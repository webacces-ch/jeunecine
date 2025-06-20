const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  res.status(200).json({ message: "Upload route" });
});

module.exports = router;
