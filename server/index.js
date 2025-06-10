// Express server setup for authentication (login, JWT, password hash)
const express = require("express");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const articleRoutes = require("./routes/article");
const sponsorRoutes = require("./routes/sponsor");
const filmRoutes = require("./routes/film");
const userRoutes = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

const allowedOrigins = [
  "http://localhost:3000",
  "https://jeunecine.vercel.app",
  "https://leonardwicki.emf-informatique.ch",
  "https://leonardwicki.emf-informatique.ch:4000",
];
app.use(
  cors({
    origin: function (origin, callback) {
      // Autorise les requêtes sans origin (ex: curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));

// Servir les fichiers uploadés statiquement
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.use et routes
app.use("/api", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/sponsors", sponsorRoutes);
app.use("/api/films", filmRoutes);
app.use("/api/user", userRoutes);

// 404 handler pour toutes les autres routes
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
