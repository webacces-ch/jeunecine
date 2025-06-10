const express = require("express");
const router = express.Router();
const filmController = require("../controllers/filmController");
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  uploadFilms,
  uploadFilmsVideo,
  logUploadVideoError,
} = require("../middleware/upload");

// La route GET / est publique
router.get("/", filmController.getAll);
// La route GET /:id doit aussi être publique
router.get("/:id", filmController.getById);
// Les autres routes restent protégées
router.post(
  "/",
  authenticateToken,
  uploadFilms.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  filmController.create
);
router.put(
  "/:id",
  authenticateToken,
  uploadFilms.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  filmController.update
);
router.delete("/:id", authenticateToken, filmController.delete);
// Route d'upload vidéo seule (pour upload direct avec barre de progression)
router.post(
  "/upload-video",
  authenticateToken,
  (req, res, next) =>
    uploadFilmsVideo(req, res, (err) =>
      logUploadVideoError(err, req, res, next)
    ),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier vidéo reçu" });
    }
    const videoUrl = `/uploads/films/${req.file.filename}`;
    res.json({ videoUrl });
  }
);

module.exports = router;
