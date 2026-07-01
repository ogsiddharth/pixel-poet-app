const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./pixelpoet.db', (err) => {
    if (err) console.error("DB Connection Error:", err.message);
    else console.log("Connected to Pixel Poet SQL Database.");
});

// SQL Table Creation
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS captions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            caption_text TEXT NOT NULL,
            category TEXT NOT NULL,
            views_count INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

module.exports = db;