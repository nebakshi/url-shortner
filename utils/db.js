const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./url-shortner.db');

const createTable = `CREATE TABLE IF NOT EXISTS urls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  original_url TEXT NOT NULL,
  shortened_url TEXT NOT NULL
);`;
db.run(createTable);

module.exports = db;