// Contrôleur Article
const Article = require("../models/article");

exports.getAll = (req, res) => {
  Article.getAll((err, rows) => {
    if (err) {
      console.error("Erreur dans getAll articles:", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    console.log("Articles récupérés:", rows?.length);
    res.json(rows);
  });
};

exports.getById = (req, res) => {
  Article.getById(req.params.id, (err, row) => {
    if (err || !row) {
      console.error("Erreur dans getById article:", err, req.params.id);
      return res.status(404).json({ error: "Article non trouvé" });
    }
    console.log("Article récupéré:", row?.id);
    res.json(row);
  });
};

exports.create = (req, res) => {
  const { title, content, date, author, status, coverImage, tags, summary } =
    req.body;
  console.log("Requête création article:", req.body);
  if (!title || !content || !date || !author || !status) {
    console.error("Champs manquants pour création article:", req.body);
    return res.status(400).json({ error: "Champs manquants" });
  }
  Article.create(
    { title, content, date, author, status, coverImage, tags, summary },
    (err, id) => {
      if (err) {
        console.error("Erreur création article:", err);
        return res.status(500).json({ error: "Erreur création" });
      }
      res
        .status(201)
        .json({
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
  console.log("Données reçues pour update article:", {
    title,
    content,
    date,
    author,
    status,
    coverImage,
    tags,
    summary,
    id: req.params.id,
  });
  Article.update(
    req.params.id,
    { title, content, date, author, status, coverImage, tags, summary },
    (err) => {
      if (err) {
        console.error("Erreur update article:", err);
        return res.status(500).json({ error: "Erreur MAJ" });
      }
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
  console.log("Suppression article id:", req.params.id);
  Article.delete(req.params.id, (err) => {
    if (err) {
      console.error("Erreur suppression article:", err);
      return res.status(500).json({ error: "Erreur suppression" });
    }
    res.json({ success: true });
  });
};

// Récupère uniquement les articles publiés (public)
exports.getPublished = (req, res) => {
  Article.getPublished((err, rows) => {
    if (err) {
      console.error("Erreur getPublished articles:", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    console.log("Articles publiés récupérés:", rows?.length);
    res.json(rows);
  });
};
