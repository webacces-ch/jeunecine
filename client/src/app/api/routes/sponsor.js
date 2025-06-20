const express = require("express");
const router = express.Router();
const Sponsor = require("../models/sponsor");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const upload = multer({
  dest: path.join(__dirname, "../../client/public/sponsors/"),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Seules les images sont autorisées"));
    }
    cb(null, true);
  },
});

// GET tous les sponsors
router.get("/", (req, res) => {
  Sponsor.findAll((err, sponsors) => {
    if (err) {
      return res.status(500).json({ error: "Erreur serveur" });
    }
    res.json(sponsors);
  });
});

// GET un sponsor par ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  // Vous devez ajouter cette méthode à votre modèle Sponsor
  Sponsor.findById(id, (err, sponsor) => {
    if (err) {
      return res.status(500).json({ error: "Erreur serveur" });
    }
    if (!sponsor) {
      return res.status(404).json({ error: "Sponsor non trouvé" });
    }
    res.json(sponsor);
  });
});

// POST créer un nouveau sponsor avec upload d'image
router.post(
  "/",
  upload.single("image"),
  async (req, res) => {
    const { link } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "Image requise" });
    }
    // Renommer le fichier pour garder l’extension
    const ext = path.extname(req.file.originalname);
    const newFilename = `${Date.now()}-${Math.floor(Math.random() * 1e6)}${ext}`;
    const fs = require("fs");
    const oldPath = req.file.path;
    const newPath = path.join(req.file.destination, newFilename);
    fs.renameSync(oldPath, newPath);

    // Stocker en base
    const imageUrl = `/sponsors/${newFilename}`;

    Sponsor.create(imageUrl, link || "", (err, insertId) => {
      if (err) {
        // Supprimer le fichier si erreur DB
        fs.unlinkSync(req.file.path);
        return res.status(500).json({ error: "Erreur création sponsor" });
      }
      res.status(201).json({
        id: insertId,
        imageUrl,
        link: link || "",
        message: "Sponsor créé avec succès",
      });
    });
  }
);

// DELETE supprimer un sponsor
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  // D'abord récupérer le sponsor pour obtenir l'URL de l'image
  Sponsor.findById(id, (err, sponsor) => {
    if (err) {
      return res.status(500).json({ error: "Erreur serveur" });
    }

    if (!sponsor) {
      return res.status(404).json({ error: "Sponsor non trouvé" });
    }

    // Supprimer de la DB
    Sponsor.delete(id, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Erreur suppression" });
      }

      // Supprimer le fichier image du serveur
      if (sponsor.imageUrl) {
        const imagePath = path.join(__dirname, "../", sponsor.imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      res.json({ message: "Sponsor supprimé avec succès" });
    });
  });
});

module.exports = router;
