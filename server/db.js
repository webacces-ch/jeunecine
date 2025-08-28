// Connexion à la base de données MySQL
const mysql = require("mysql2");
require("dotenv").config();

const password =
  process.env.DB_PASSWORD !== undefined
    ? process.env.DB_PASSWORD
    : process.env.DB_PASS || "";

const connConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || "root",
  password,
  database: process.env.DB_NAME || "cinema",
  multipleStatements: false,
};

// Log léger de debug (mot de passe masqué) au premier lancement
if (!global.__DB_DEBUG_LOGGED) {
  global.__DB_DEBUG_LOGGED = true;
  console.log("[DB] Config:", {
    host: connConfig.host,
    port: connConfig.port,
    user: connConfig.user,
    hasPassword: !!password,
    db: connConfig.database,
  });
}

const db = mysql.createConnection(connConfig);

db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données:", err);
  } else {
    console.log("Connecté à la base de données MySQL");
  }
});

// Petite fonction de health check
db.healthCheck = (cb) => {
  db.query("SELECT 1 AS ok", (err, rows) => {
    if (err) return cb(err);
    cb(null, rows && rows[0] && rows[0].ok === 1);
  });
};

module.exports = db;
