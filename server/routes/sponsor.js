const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const Sponsor = require("../models/sponsor");
// Réutilise le middleware générique (stocke dans server/uploads/sponsors)
const { upload } = require("../middleware/upload");

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
router.post("/", upload.single("image"), async (req, res) => {
  const { link } = req.body;
  if (!req.file) {
    return res.status(400).json({ error: "Image requise" });
  }
  // Le middleware nomme déjà sponsor-<unique>.<ext>
  const imageUrl = `/uploads/sponsors/${req.file.filename}`;
  Sponsor.create(imageUrl, link || "", (err, insertId) => {
    if (err) {
      // Supprime le fichier si erreur DB
      try {
        fs.unlinkSync(req.file.path);
      } catch {}
      return res.status(500).json({ error: "Erreur création sponsor" });
    }
    res.status(201).json({
      id: insertId,
      imageUrl,
      link: link || "",
      message: "Sponsor créé avec succès",
    });
  });
});

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
        const rel = sponsor.imageUrl.replace(/^\//, "");
        const imagePath = path.join(__dirname, "..", rel);
        if (fs.existsSync(imagePath)) {
          try { fs.unlinkSync(imagePath); } catch {}
        }
      }

      res.json({ message: "Sponsor supprimé avec succès" });
    });
  });
});

module.exports = router;
