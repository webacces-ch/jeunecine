// Auth controller
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Missing fields" });
  const hash = await bcrypt.hash(password, 10);
  User.create(username, hash, (err, id) => {
    if (err) return res.status(400).json({ error: "User exists" });
    res.json({ id, username });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Missing fields" });
  User.findByUsername(username, async (err, user) => {
    if (err || !user)
      return res.status(401).json({ error: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
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
