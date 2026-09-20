const express = require('express');
const cors = require('cors');
const ethers = require('ethers');
const db = require('./database');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

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
     const fetch = (await import('node-fetch')).default;
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

app.listen(PORT, () => {
  console.log(`?? BhuSetu Backend Server running on http://localhost:${PORT}`);
});
