// User model (reuse central MySQL connection)
// We reuse the shared connection defined in ../db to avoid diverging env var names
const db = require("../db");

// Création de la table users si elle n'existe pas
const userTableSql = `CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
)`;
db.query(userTableSql, (err) => {
  if (err) console.error("Erreur création table users:", err);
});

// Ajout du champ name si absent
// Safe alter to add name column if missing
const alterUserTableSql = `ALTER TABLE users ADD COLUMN name VARCHAR(255) DEFAULT ''`;
db.query(alterUserTableSql, (err) => {
  if (err && !/Duplicate column|ER_DUP_FIELDNAME/.test(err.message)) {
    console.error("Erreur ajout colonne name:", err);
  }
});

const User = {
  create: (username, hash, cb) => {
    db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hash],
      function (err, result) {
        cb(err, result ? result.insertId : null);
      }
    );
  },
  findByUsername: (username, cb) => {
    db.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err, results) => {
        cb(err, results && results[0] ? results[0] : null);
      }
    );
  },
  findById: (id, cb) => {
    db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
      cb(err, results && results[0] ? results[0] : null);
    });
  },
  updateName: (id, name, cb) => {
    db.query(
      "UPDATE users SET name = ? WHERE id = ?",
      [name, id],
      (err, result) => {
        cb(err, result);
      }
    );
  },
};

module.exports = User;
