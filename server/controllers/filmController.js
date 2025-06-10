// Contrôleur Film
const Film = require("../models/film");

exports.getAll = (req, res) => {
  Film.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: "Erreur serveur" });
    res.json(rows);
  });
};

exports.getById = (req, res) => {
  Film.getById(req.params.id, (err, row) => {
    if (err || !row) return res.status(404).json({ error: "Film non trouvé" });
    res.json(row);
  });
};

exports.create = (req, res) => {
  const { title, subtitle, youtube, description } = req.body;
  let imageUrl = null;
  if (req.file) {
    imageUrl = `/uploads/films/${req.file.filename}`;
  } else if (req.body.imageUrl) {
    imageUrl = req.body.imageUrl;
  }
  if (!title) return res.status(400).json({ error: "Champs manquants" });
  Film.create(
    { title, subtitle, youtube, description, imageUrl },
    (err, id) => {
      if (err) return res.status(500).json({ error: "Erreur création" });
      res
        .status(201)
        .json({ id, title, subtitle, youtube, description, imageUrl });
    }
  );
};

exports.update = (req, res) => {
  const { title, subtitle, youtube, description } = req.body;
  let imageUrl = null;
  if (req.file) {
    imageUrl = `/uploads/films/${req.file.filename}`;
  } else if (req.body.imageUrl) {
    imageUrl = req.body.imageUrl;
  }
  Film.update(
    req.params.id,
    { title, subtitle, youtube, description, imageUrl },
    (err) => {
      if (err) return res.status(500).json({ error: "Erreur MAJ" });
      res.json({
        id: req.params.id,
        title,
        subtitle,
        youtube,
        description,
        imageUrl,
      });
    }
  );
};

exports.delete = (req, res) => {
  Film.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: "Erreur suppression" });
    res.json({ success: true });
  });
};
