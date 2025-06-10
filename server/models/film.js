// Modèle Film pour MySQL
const db = require("../db");

// Création de la table films si elle n'existe pas
const filmTableSql = `CREATE TABLE IF NOT EXISTS films (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  youtube VARCHAR(255),
  description TEXT,
  imageUrl VARCHAR(512)
)`;

db.query(filmTableSql, (err) => {
  if (err) console.error("Erreur création table films:", err);
  else console.log("Connected to MySQL DB (film)");
});

const Film = {
  getAll: (cb) => {
    db.query("SELECT * FROM films", (err, results) => cb(err, results));
  },
  getById: (id, cb) => {
    db.query("SELECT * FROM films WHERE id = ?", [id], (err, results) =>
      cb(err, results[0])
    );
  },
  create: (film, cb) => {
    db.query(
      "INSERT INTO films (title, subtitle, youtube, description, imageUrl) VALUES (?, ?, ?, ?, ?)",
      [
        film.title,
        film.subtitle,
        film.youtube,
        film.description,
        film.imageUrl,
      ],
      (err, result) => cb(err, result ? result.insertId : null)
    );
  },
  update: (id, film, cb) => {
    db.query(
      "UPDATE films SET title = ?, subtitle = ?, youtube = ?, description = ?, imageUrl = ? WHERE id = ?",
      [
        film.title,
        film.subtitle,
        film.youtube,
        film.description,
        film.imageUrl,
        id,
      ],
      (err) => cb(err)
    );
  },
  delete: (id, cb) => {
    db.query("DELETE FROM films WHERE id = ?", [id], (err) => cb(err));
  },
};

module.exports = Film;
