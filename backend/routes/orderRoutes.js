const express = require("express");
const router = express.Router();

// Exemple route GET
router.get("/", (req, res) => {
  res.json({ message: "Liste des commandes" });
});

// 🔹 Export correct
module.exports = router;
