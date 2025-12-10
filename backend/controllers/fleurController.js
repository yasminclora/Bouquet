const { Fleur } = require("../models");


exports.getAll = async (req, res) => {
  try {
    const fleurs = await Fleur.findAll();
    res.json(fleurs);
  } catch (err) { res.status(500).json({ err }); }
};




exports.create = async (req, res) => {
  try {
    const { nom, description, prixUnitaire } = req.body;
    const f = await Fleur.create({ nom, description, prixUnitaire });
    res.status(201).json(f);
  } catch (err) { res.status(500).json({ err }); }
};



exports.deleteFlower = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Fleur.destroy({ where: { id } });
    if (!result) return res.status(404).json({ message: "flower introuvable" });
    res.json({ message: "flower supprimé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur suppression flower", err });
  }
};