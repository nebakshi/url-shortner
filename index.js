const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.json());
const db = new sqlite3.Database('./url-shortner.db');
const port = 3000;

// Create table
const createTable = `CREATE TABLE IF NOT EXISTS urls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  original_url TEXT NOT NULL,
  shortened_url TEXT NOT NULL
);`;
db.run(createTable);

// Get all shortened URLs
app.get('/urls', (req, res) => {
  const query = 'SELECT * FROM urls';
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).send({ message: 'Error fetching URLs' });
    } else {
      res.send(rows);
    }
  });
});

// Create a new shortened URL
app.post('/urls', (req, res) => {
  const { originalUrl } = req.body;
  const shortenedUrl = Math.random().toString(36).substr(2, 6);
  const query = 'INSERT INTO urls (original_url, shortened_url) VALUES (?, ?)';
  db.run(query, [originalUrl, shortenedUrl], (err) => {
    if (err) {
      res.status(500).send({ message: 'Error creating URL' });
    } else {
      res.send({ shortenedUrl });
    }
  });
});

// Get a shortened URL by ID
app.get('/urls/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM urls WHERE id = ?';
  db.get(query, [id], (err, row) => {
    if (err) {
      res.status(500).send({ message: 'Error fetching URL' });
    } else if (row) {
      res.send(row);
    } else {
      res.status(404).send({ message: 'URL not found' });
    }
  });
});

// Delete a shortened URL by ID
app.delete('/urls/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM urls WHERE id = ?';
  db.run(query, [id], (err) => {
    if (err) {
      res.status(500).send({ message: 'Error deleting URL' });
    } else {
      res.send({ message: 'URL deleted successfully' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});