const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, "../uploads/sponsors");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Générer un nom unique pour éviter les conflits
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "sponsor-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Accepter seulement les images
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Seules les images sont autorisées!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

// Ajout d'un export pour l'upload films (dossier séparé)
const uploadsFilmsDir = path.join(__dirname, "../uploads/films");
if (!fs.existsSync(uploadsFilmsDir)) {
  fs.mkdirSync(uploadsFilmsDir, { recursive: true });
}

const storageFilms = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsFilmsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "film-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadFilms = multer({
  storage: storageFilms,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});

// Ajout d'un export pour l'upload d'articles (images)
const uploadsArticlesDir = path.join(__dirname, "../uploads/articles");
if (!fs.existsSync(uploadsArticlesDir)) {
  fs.mkdirSync(uploadsArticlesDir, { recursive: true });
}

const storageArticles = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsArticlesDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "article-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadArticles = multer({
  storage: storageArticles,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});

// Ajout d'un export pour l'upload de vidéos de films (dossier séparé)
const uploadsFilmsVideoDir = path.join(__dirname, "../uploads/films");
if (!fs.existsSync(uploadsFilmsVideoDir)) {
  fs.mkdirSync(uploadsFilmsVideoDir, { recursive: true });
}

const storageFilmsVideo = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsFilmsVideoDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "filmvideo-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilterVideo = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Seuls les fichiers vidéo sont autorisés!"), false);
  }
};

const uploadFilmsVideo = multer({
  storage: storageFilmsVideo,
  fileFilter: fileFilterVideo,
  limits: {
    fileSize: 10 * 1024 * 1024 * 1024, // 10Go max
  },
}).single("video");

// Middleware de log d'erreur pour l'upload vidéo
function logUploadVideoError(err, req, res, next) {
  if (err) {
    console.error("[UPLOAD FILM VIDEO]", err);
    return res
      .status(500)
      .json({ error: err.message || "Erreur upload vidéo" });
  }
  next();
}

module.exports = {
  upload,
  uploadFilms,
  uploadFilmsVideo,
  uploadArticles,
  logUploadVideoError,
};
