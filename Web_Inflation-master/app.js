const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const db = new sqlite3.Database(path.join(__dirname, 'db', 'sqlite.db'), (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('已連接到 SQLite 資料庫。');
        db.run(`CREATE TABLE IF NOT EXISTS BentoPrices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bento TEXT NOT NULL,
            date TEXT NOT NULL,
            price REAL NOT NULL
        )`, (err) => {
            if (err) {
                console.error('創建 BentoPrices 表時出錯:', err.message);
            } else {
                console.log('BentoPrices 表創建成功。');
            }
        });
    }
});

app.get('/api/prices', (req, res) => {
    const sql = 'SELECT * FROM BentoPrices ORDER BY date';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ prices: rows });
    });
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log('伺服器運行於 http://localhost:3000');
});

module.exports = app;
