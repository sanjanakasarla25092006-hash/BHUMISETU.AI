const express = require('express');
const cors = require('cors');
const ethers = require('ethers');
const db = require('./database');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// --- MOCK BLOCKCHAIN SETUP ---
// In a production environment, this would connect to a real RPC node (e.g. Alchemy/Infura for Sepolia)
// For this local prototype, we generate a random wallet and mock the transaction hashing to prove the concept.
const wallet = ethers.Wallet.createRandom();
console.log(`[Blockchain] Initialized mock government wallet: ${wallet.address}`);

// --- API ENDPOINTS ---

// 1. Fetch Resources (Search & Filter)
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

  if (state && state !== 'All') {
    query += ' AND state = ?';
    params.push(state);
  }

  if (year && year !== 'All') {
    query += ' AND year = ?';
    params.push(year);
  }

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

// 2. Fetch Single Resource
app.get('/api/resources/:id', (req, res) => {
  db.get('SELECT * FROM resources WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  });
});

// 3. Blockchain Securing Endpoint (Simulate pinning to IPFS & Blockchain)
app.post('/api/secure-record', async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'Record ID required' });

  db.get('SELECT * FROM resources WHERE id = ?', [id], async (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'Record not found' });
    
    // Simulate Blockchain Hashing (SHA-256 of the record data)
    const recordData = JSON.stringify({ id: row.id, title: row.title, content: row.summary });
    const documentHash = ethers.keccak256(ethers.toUtf8Bytes(recordData));
    
    // Simulate a transaction signature by the Government Wallet
    const signature = await wallet.signMessage(ethers.getBytes(documentHash));
    
    // In a real app, you would send a transaction to a Smart Contract here.
    const mockTxHash = "0x" + Math.random().toString(16).slice(2, 66).padEnd(64, '0');

    // Save the tx hash back to SQLite
    db.run('UPDATE resources SET blockchain_tx = ? WHERE id = ?', [mockTxHash, id], (updateErr) => {
      if (updateErr) return res.status(500).json({ error: updateErr.message });
      
      res.json({
        success: true,
        message: 'Record successfully secured on the blockchain.',
        documentHash: documentHash,
        walletAddress: wallet.address,
        txHash: mockTxHash,
        signature: signature
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`?? BhuSetu Backend Server running on http://localhost:${PORT}`);
});
