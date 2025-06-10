// Express server setup for authentication (login, JWT, password hash)
const express = require("express");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const articleRoutes = require("./routes/article");
const sponsorRoutes = require("./routes/sponsor");
const filmRoutes = require("./routes/film");
const userRoutes = require("./routes/user");

const app = express();

// Configuration du port pour cPanel
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "localhost"; // cPanel peut imposer localhost au lieu de 0.0.0.0

// Configuration CORS mise à jour
const allowedOrigins = [
  "http://localhost:3000",
  "https://jeunecine.vercel.app",
  "https://leonardwicki.emf-informatique.ch",
  "https://www.leonardwicki.emf-informatique.ch", // Ajouter www si nécessaire
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Autorise les requêtes sans origin (ex: curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.log("CORS blocked origin:", origin); // Pour debug
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));

// Servir les fichiers uploadés statiquement
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route de test pour vérifier que le serveur fonctionne
app.get("/", (req, res) => {
  res.json({
    message: "Jeunecine API is running",
    port: PORT,
    env: process.env.NODE_ENV || "development",
  });
});

// Routes API
app.use("/", authRoutes);
app.use("/articles", articleRoutes);
app.use("/sponsors", sponsorRoutes);
app.use("/films", filmRoutes);
app.use("/user", userRoutes);

// 404 handler pour toutes les autres routes
app.use((req, res) => {
  console.warn(`[404] Route non trouvée : ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: "Not found", path: req.path });
});

// Démarrage du serveur
app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

// Gestion des erreurs non capturées
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});
