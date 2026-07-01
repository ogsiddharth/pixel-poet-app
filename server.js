const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 1. GET: Saare captions database se nikalna (SELECT)
app.get('/api/captions', (req, res) => {
    const sql = "SELECT * FROM captions ORDER BY created_at DESC";
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 2. POST: Naya caption save karna (INSERT)
app.post('/api/captions', (req, res) => {
    const { caption_text, category } = req.body;
    if (!caption_text || !category) {
        return res.status(400).json({ error: "Fields cannot be empty" });
    }
    const sql = "INSERT INTO captions (caption_text, category) VALUES (?, ?)";
    db.run(sql, [caption_text, category], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, caption_text, category, views_count: 0 });
    });
});

// 3. PUT: Views count badhana (UPDATE)
app.put('/api/captions/:id/view', (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE captions SET views_count = views_count + 1 WHERE id = ?";
    db.run(sql, id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "View updated" });
    });
});

// 4. DELETE: Caption delete karna (DELETE)
app.delete('/api/captions/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM captions WHERE id = ?";
    db.run(sql, id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted successfully" });
    });
});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});