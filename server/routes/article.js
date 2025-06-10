const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { uploadArticles } = require("../middleware/upload");

// REND LA ROUTE GET /api/articles PUBLIQUE (PAS DE TOKEN REQUIS)
router.get("/", articleController.getAll);
// Rend la route GET /api/articles/:id publique (pas de token requis)
router.get("/:id", articleController.getById);
router.post("/", authenticateToken, articleController.create);
router.put("/:id", authenticateToken, articleController.update);
router.delete("/:id", authenticateToken, articleController.delete);
// Ajout route upload image pour article
router.post(
  "/upload-image",
  authenticateToken,
  uploadArticles.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier reçu" });
    }
    // Retourner l'URL relative de l'image
    const url = `/uploads/articles/${req.file.filename}`;
    res.json({ url });
  }
);
// Route publique pour récupérer uniquement les articles publiés (sans token)
router.get("/public", articleController.getPublished);

module.exports = router;
