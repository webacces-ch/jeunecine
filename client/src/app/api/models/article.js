const db = require("../db");

// Création de la table articles si elle n'existe pas
const articleTableSql = `CREATE TABLE IF NOT EXISTS articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  author VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  coverImage VARCHAR(512),
  tags TEXT,
  summary TEXT
)`;
db.query(articleTableSql, (err) => {
  if (err) console.error("Erreur création table articles:", err);
});

const Article = {
  getAll: (cb) => {
    db.query("SELECT * FROM articles", (err, results) => cb(err, results));
  },
  getById: (id, cb) => {
    db.query("SELECT * FROM articles WHERE id = ?", [id], (err, results) =>
      cb(err, results && results[0] ? results[0] : null)
    );
  },
  create: (article, cb) => {
    db.query(
      "INSERT INTO articles (title, content, date, author, status, coverImage, tags, summary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        article.title,
        article.content,
        article.date,
        article.author,
        article.status,
        article.coverImage || null,
        Array.isArray(article.tags) ? JSON.stringify(article.tags) : null,
        article.summary || null,
      ],
      function (err, result) {
        cb(err, result ? result.insertId : null);
      }
    );
  },
  update: (id, article, cb) => {
    db.query(
      "UPDATE articles SET title = ?, content = ?, date = ?, author = ?, status = ?, coverImage = ?, tags = ?, summary = ? WHERE id = ?",
      [
        article.title,
        article.content,
        article.date,
        article.author,
        article.status,
        article.coverImage || null,
        Array.isArray(article.tags) ? JSON.stringify(article.tags) : null,
        article.summary || null,
        id,
      ],
      (err, result) => {
        if (err) console.error("Erreur SQL update:", err);
        else console.log("Résultat update:", result);
        cb(err, result);
      }
    );
  },
  delete: (id, cb) => {
    db.query("DELETE FROM articles WHERE id = ?", [id], cb);
  },
  getPublished: (cb) => {
    db.query(
      "SELECT * FROM articles WHERE status = 'published' ORDER BY date DESC",
      (err, results) => cb(err, results)
    );
  },
};

module.exports = Article;
