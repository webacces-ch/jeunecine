const express = require("express");
const router = express.Router();
const filmController = require("../controllers/filmController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { uploadFilms } = require("../middleware/upload");

// La route GET / est publique
router.get("/", filmController.getAll);
// La route GET /:id doit aussi être publique
router.get("/:id", filmController.getById);
// Les autres routes restent protégées
router.post(
  "/",
  authenticateToken,
  uploadFilms.single("image"),
  filmController.create
);
router.put(
  "/:id",
  authenticateToken,
  uploadFilms.single("image"),
  filmController.update
);
router.delete("/:id", authenticateToken, filmController.delete);

module.exports = router;
