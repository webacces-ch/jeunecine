const db = require("../db");

// Création de la table sponsors si elle n'existe pas
const sponsorTableSql = `CREATE TABLE IF NOT EXISTS sponsors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  imageUrl VARCHAR(512) NOT NULL,
  link VARCHAR(512)
)`;
db.query(sponsorTableSql, (err) => {
  if (err) console.error("Erreur création table sponsors:", err);
});

const Sponsor = {
  create: (imageUrl, link, cb) => {
    db.query(
      "INSERT INTO sponsors (imageUrl, link) VALUES (?, ?)",
      [imageUrl, link],
      function (err, result) {
        if (typeof cb === "function") cb(err, result ? result.insertId : null);
      }
    );
  },
  findAll: (cb) => {
    db.query("SELECT * FROM sponsors ORDER BY id DESC", (err, results) => {
      if (typeof cb === "function") cb(err, results);
    });
  },
  // Nouvelle méthode pour trouver par ID
  findById: (id, cb) => {
    db.query("SELECT * FROM sponsors WHERE id = ?", [id], (err, results) => {
      if (typeof cb === "function") {
        cb(err, results && results[0] ? results[0] : null);
      }
    });
  },
  delete: (id, cb) => {
    db.query("DELETE FROM sponsors WHERE id = ?", [id], (err, result) =>
      cb(err, result)
    );
  },
};

module.exports = Sponsor;
