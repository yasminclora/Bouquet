const express = require("express");
const router = express.Router();
const utilisateurController = require("../controllers/utilisateur.controller");

router.post("/register", utilisateurController.register);
router.post("/login", utilisateurController.login);
router.post("/logout", utilisateurController.logout);


router.get("/me", utilisateurController.me);

module.exports = router;
