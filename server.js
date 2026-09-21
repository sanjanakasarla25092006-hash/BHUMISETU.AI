const express = require('express');
const cors = require('cors');
const ethers = require('ethers');
const db = require('./database');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: function (origin, callback) {
    const allowed = [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'];
    if (!origin || allowed.includes(origin) || allowed.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const wallet = ethers.Wallet.createRandom();

app.get('/api/resources', (req, res) => {
  const { q, state, year, types } = req.query;
  let query = 'SELECT * FROM resources WHERE 1=1';
  let params = [];
  if (types) {
    const typeArray = types.split(',');
    const placeholders = typeArray.map(() => '?').join(',');
    query += ` AND type IN (${placeholders})`;
    params.push(...typeArray);
  }
  if (state && state !== 'All') { query += ' AND state = ?'; params.push(state); }
  if (year && year !== 'All') { query += ' AND year = ?'; params.push(year); }
  if (q) {
    query += ' AND (LOWER(title) LIKE ? OR LOWER(summary) LIKE ? OR LOWER(topic) LIKE ?)';
    const searchStr = `%${q.toLowerCase()}%`;
    params.push(searchStr, searchStr, searchStr);
  }
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/resources/:id', (req, res) => {
  db.get('SELECT * FROM resources WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  });
});

app.post('/api/secure-record', async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'Record ID required' });
  db.get('SELECT * FROM resources WHERE id = ?', [id], async (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'Record not found' });
    const recordData = JSON.stringify({ id: row.id, title: row.title, content: row.summary });
    const documentHash = ethers.keccak256(ethers.toUtf8Bytes(recordData));
    const signature = await wallet.signMessage(ethers.getBytes(documentHash));
    const mockTxHash = "0x" + Math.random().toString(16).slice(2, 66).padEnd(64, '0');
    db.run('UPDATE resources SET blockchain_tx = ? WHERE id = ?', [mockTxHash, id], (updateErr) => {
      if (updateErr) return res.status(500).json({ error: updateErr.message });
      res.json({ success: true, message: 'Record successfully secured.', documentHash, walletAddress: wallet.address, txHash: mockTxHash, signature });
    });
  });
});



// --- AUTH ROUTES ---
const otps = {}; // In-memory OTP store for demo

app.post('/api/auth/request-otp', async (req, res) => {
  const { mobile, role, name } = req.body;
  if (!mobile || !role) return res.status(400).json({ error: 'Mobile and Role required' });
  
  // Save user in DB if not exists
  db.get('SELECT * FROM users WHERE mobile = $1', [mobile], (err, row) => {
    if (!row) {
      db.run('INSERT INTO users (mobile, role) VALUES ($1, $2)', [mobile, role], () => {});
    } else if (row.role !== role) {
      // Prevent changing role if already registered
      return res.status(403).json({ error: `Mobile already registered as ${row.role}. Please login with that role.` });
    }
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otps[mobile] = otp;
    
    // Try sending SMS via Fast2SMS
    const fast2smsKey = process.env.FAST2SMS_API_KEY;
    if (fast2smsKey) {
      const cleanNumber = mobile.replace('+91', '');
      
        fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: { 'authorization': fast2smsKey, 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `route=otp&variables_values=${otp}&flash=0&numbers=${cleanNumber}`
        }).catch(() => {
      });
    }
    
    res.json({ success: true, simulated_otp: otp, message: fast2smsKey ? 'OTP sent via SMS' : 'No API key, using simulated OTP.' });
  });
});

app.post('/api/auth/verify', (req, res) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp) return res.status(400).json({ error: 'Mobile and OTP required' });
  
  if (otps[mobile] === otp) {
    delete otps[mobile];
    db.get('SELECT * FROM users WHERE mobile = $1', [mobile], (err, row) => {
      if (err || !row) return res.status(404).json({ error: 'User not found' });
      res.json({ success: true, token: 'demo-token-' + row.role, user: row });
    });
  } else {
    res.status(401).json({ error: 'Invalid OTP' });
  }
});

// --- AI CHATBOT ROUTE ---
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  // In production, you will place your GEMINI_API_KEY or OPENAI_API_KEY in a .env file.
  const apiKey = process.env.GEMINI_API_KEY; 
  
  if (!apiKey) {
     // Fallback smart mock logic if API key isn't setup yet
     console.log("No API Key found. Returning simulated smart response.");
     setTimeout(() => {
        let reply = "I am the BhuSetu AI Assistant. ";
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes("blockchain")) reply += "We use blockchain to cryptographically secure land records via smart contracts to ensure they cannot be tampered with.";
        else if (lowerMsg.includes("land") || lowerMsg.includes("record")) reply += "Land records and governance acts are digitized here. I can help you find specific laws or spatial datasets.";
        else reply += "To answer your question '" + message + "' fully, please add your Google Gemini or OpenAI API key to the backend server environment variables (.env).";
        
        return res.json({ reply });
     }, 1000);
     return;
  }

  // Real LLM Integration (Example using Gemini REST API)
  try {
     
     const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           contents: [{ parts: [{ text: "You are the BhuSetu AI Land Governance Assistant. Keep answers concise. User says: " + message }]}]
        })
     });
     const data = await response.json();
     if(data.candidates && data.candidates[0]) {
        res.json({ reply: data.candidates[0].content.parts[0].text });
     } else {
        res.json({ reply: "Sorry, the AI service is currently unavailable." });
     }
  } catch(err) {
     res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => res.send('BhuSetu API Backend is running! Please open your frontend on localhost:3000 to use the app.'));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`?? BhuSetu Backend Server running on http://localhost:${PORT}`);
});
