// Auth controller
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const DEBUG_INSECURE = process.env.DEBUG_INSECURE_LOGIN === "true";

exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Missing fields" });
  const hash = await bcryptjs.hash(password, 10);
  User.create(username, hash, (err, id) => {
    if (err) return res.status(400).json({ error: "User exists" });
    res.json({ id, username });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Missing fields" });
  // Mode debug: autoriser admin/admin sans vérif hash si activé
  if (DEBUG_INSECURE && username === "admin" && password === "admin") {
    // S'assurer que l'utilisateur existe (avec un hash standard pour ne pas casser le modèle)
    User.findByUsername("admin", async (err, user) => {
      if (!user) {
        const bcryptjs = require("bcryptjs");
        const hash = await bcryptjs.hash("admin", 4); // hash rapide (cost bas car debug)
        User.create("admin", hash, () => {
          const token = jwt.sign({ id: 0, username: "admin" }, JWT_SECRET, {
            expiresIn: "2h",
          });
          return res.json({ token, debug: true });
        });
      } else {
        const token = jwt.sign(
          { id: user.id, username: user.username },
          JWT_SECRET,
          { expiresIn: "2h" }
        );
        return res.json({ token, debug: true });
      }
    });
    return; // Sortir pour ne pas exécuter la suite
  }
  User.findByUsername(username, async (err, user) => {
    if (err || !user)
      return res.status(401).json({ error: "Invalid credentials" });
    const match = await bcryptjs.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.json({ token });
  });
};

exports.protected = (req, res) => {
  res.json({ message: "Access granted", user: req.user });
};
