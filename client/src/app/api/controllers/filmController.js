// Contrôleur Film
const Film = require("../models/film");

exports.getAll = (req, res) => {
  Film.getAll((err, rows) => {
    if (err) {
      console.error("Erreur dans getAll films:", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    console.log("Films récupérés:", rows?.length);
    res.json(rows);
  });
};

exports.getById = (req, res) => {
  Film.getById(req.params.id, (err, row) => {
    if (err || !row) {
      console.error("Erreur dans getById film:", err, req.params.id);
      return res.status(404).json({ error: "Film non trouvé" });
    }
    console.log("Film récupéré:", row?.id);
    res.json(row);
  });
};

exports.create = (req, res) => {
  const { title, subtitle, youtube, description } = req.body;
  let imageUrl = null;
  // Ajout log pour debug upload
  console.log("Fichiers reçus :", req.files);
  if (req.files && req.files.image && req.files.image[0]) {
    imageUrl = `/uploads/films/${req.files.image[0].filename}`;
  } else if (req.body.imageUrl) {
    imageUrl = req.body.imageUrl;
  }
  console.log("Requête création film:", {
    title,
    subtitle,
    youtube,
    description,
    imageUrl,
  });
  if (!title) {
    console.error("Champs manquants pour création film:", req.body);
    return res.status(400).json({ error: "Champs manquants" });
  }
  Film.create(
    { title, subtitle, youtube, description, imageUrl },
    (err, id) => {
      if (err) {
        console.error("Erreur création film:", err);
        return res.status(500).json({ error: "Erreur création" });
      }
      res
        .status(201)
        .json({ id, title, subtitle, youtube, description, imageUrl });
    }
  );
};

exports.update = (req, res) => {
  const { title, subtitle, youtube, description } = req.body;
  let imageUrl = null;
  // Ajout log pour debug upload
  console.log("Fichiers reçus (update) :", req.files);
  if (req.files && req.files.image && req.files.image[0]) {
    imageUrl = `/uploads/films/${req.files.image[0].filename}`;
  } else if (req.body.imageUrl) {
    imageUrl = req.body.imageUrl;
  }
  console.log("Données reçues pour update film:", {
    title,
    subtitle,
    youtube,
    description,
    imageUrl,
    id: req.params.id,
  });
  Film.update(
    req.params.id,
    { title, subtitle, youtube, description, imageUrl },
    (err) => {
      if (err) {
        console.error("Erreur update film:", err);
        return res.status(500).json({ error: "Erreur MAJ" });
      }
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
  console.log("Suppression film id:", req.params.id);
  Film.delete(req.params.id, (err) => {
    if (err) {
      console.error("Erreur suppression film:", err);
      return res.status(500).json({ error: "Erreur suppression" });
    }
    res.json({ success: true });
  });
};
