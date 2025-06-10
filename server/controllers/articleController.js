// Contrôleur Article
const Article = require("../models/article");

exports.getAll = (req, res) => {
  Article.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: "Erreur serveur" });
    res.json(rows);
  });
};

exports.getById = (req, res) => {
  Article.getById(req.params.id, (err, row) => {
    if (err || !row)
      return res.status(404).json({ error: "Article non trouvé" });
    res.json(row);
  });
};

exports.create = (req, res) => {
  const { title, content, date, author, status, coverImage, tags, summary } =
    req.body;
  if (!title || !content || !date || !author || !status)
    return res.status(400).json({ error: "Champs manquants" });
  Article.create(
    { title, content, date, author, status, coverImage, tags, summary },
    (err, id) => {
      if (err) return res.status(500).json({ error: "Erreur création" });
      res.status(201).json({
        id,
        title,
        content,
        date,
        author,
        status,
        coverImage,
        tags,
        summary,
      });
    }
  );
};

exports.update = (req, res) => {
  const { title, content, date, author, status, coverImage, tags, summary } =
    req.body;
  // Log des données reçues pour debug
  console.log("Données reçues pour update article:", {
    title,
    content,
    date,
    author,
    status,
    coverImage,
    summary,
    id: req.params.id,
  });
  Article.update(
    req.params.id,
    { title, content, date, author, status, coverImage, tags, summary },
    (err) => {
      if (err) return res.status(500).json({ error: "Erreur MAJ" });
      res.json({
        id: req.params.id,
        title,
        content,
        date,
        author,
        status,
        coverImage,
        tags,
        summary,
      });
    }
  );
};

exports.delete = (req, res) => {
  Article.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: "Erreur suppression" });
    res.json({ success: true });
  });
};

// Récupère uniquement les articles publiés (public)
exports.getPublished = (req, res) => {
  Article.getPublished((err, rows) => {
    if (err) return res.status(500).json({ error: "Erreur serveur" });
    res.json(rows);
  });
};
