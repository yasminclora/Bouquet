// controllers/utilisateur.controller.js
const { User } = require("../models");

exports.register = async (req, res) => {
  try {
    const { login, password, fullName } = req.body;
    if (!login || !password) return res.status(400).json({ message: "login et password requis" });

    const existing = await User.findOne({ where: { login } });
    if (existing) return res.status(400).json({ message: "Login déjà utilisé" });

    const user = await User.create({ login, password, fullName });
    res.status(201).json({ message: "Utilisateur créé", login: user.login, id: user.id, fullName: user.fullName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur inscription", err });
  }
};

exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;
    if (!login || !password) return res.status(400).json({ message: "login et password requis" });

    const user = await User.findOne({ where: { login } });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const valid = await user.verifyPassword(password);
    if (!valid) return res.status(401).json({ message: "Mot de passe incorrect" });

    // Stocke les infos minimales en session
    req.session.user = { id: user.id, login: user.login, fullName: user.fullName };

    // renvoie l'user (frontend peut stocker en localStorage si besoin)
    res.json({ id: user.id, login: user.login, fullName: user.fullName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur login", err });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: "Erreur lors de la déconnexion" });
    res.clearCookie("connect.sid");
    res.json({ message: "Déconnexion réussie" });
  });
};

exports.me = (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Non connecté" });
  res.json(req.session.user);
};
