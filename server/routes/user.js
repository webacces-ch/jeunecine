const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const User = require("../models/user");

// GET /api/user/me
router.get("/me", authenticateToken, (req, res) => {
  User.findById(req.user.id, (err, user) => {
    if (err || !user)
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json({ id: user.id, name: user.name, username: user.username });
  });
});

// PUT /api/user/me
router.put("/me", authenticateToken, (req, res) => {
  const { name } = req.body;
  if (!name || name.length < 2)
    return res.status(400).json({ error: "Nom invalide" });
  User.updateName(req.user.id, name, (err) => {
    if (err)
      return res.status(500).json({ error: "Erreur lors de la mise à jour" });
    User.findById(req.user.id, (err, user) => {
      if (err || !user)
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      res.json({ id: user.id, name: user.name, username: user.username });
    });
  });
});

module.exports = router;
