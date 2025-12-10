const express = require("express");
const router = express.Router();
const multer = require("multer");
const bouquetController = require("../controllers/bouquetController");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});


const upload = multer({ storage });





// 1. Démarrer un draft

router.post("/bouquet/start", upload.single("image"), (req, res) => {
  const { nom, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : "";

  req.session.bouquetDraft = {
    nom: nom || "",
    description: description || "",
    image,
    fleurs: []
  };

  res.json({ message: "Draft démarré", draft: req.session.bouquetDraft });
});





// 2. Ajouter une fleur

router.post("/bouquet/addFleur", (req, res) => {
  if (!req.session.bouquetDraft) {
    return res.status(400).json({ message: "Aucun draft actif" });
  }

  const { fleurId, quantite } = req.body;
  if (!fleurId) return res.status(400).json({ message: "fleurId requis" });

  req.session.bouquetDraft.fleurs.push({
    fleurId,
    quantite: parseInt(quantite || 1, 10)
  });

  res.json({ message: "Fleur ajoutée", draft: req.session.bouquetDraft });
});


// 3. Finaliser le bouquet

router.post("/bouquet/finalize", upload.single("image"), async (req, res) => {
  try {
    const draft = req.session.bouquetDraft;
    if (!draft) return res.status(400).json({ message: "Aucun draft à finaliser" });

    const finalImage = req.file ? `/uploads/${req.file.filename}` : draft.image;

    const bouquetData = {
      nom: draft.nom,
      description: draft.description,
      image: finalImage,
      fleurs: draft.fleurs
    };

    if (!bouquetData.nom || !bouquetData.description || bouquetData.fleurs.length === 0) {
      return res.status(400).json({ message: "Nom, description et fleurs obligatoires" });
    }

    await bouquetController.createBouquetComplet({ body: bouquetData }, res);

    // Vider le draft
    req.session.bouquetDraft = null;

  } catch (err) {
    console.error("Erreur finalize:", err);
    res.status(500).json({ message: "Erreur interne", err });
  }
});

// Debug
router.get("/bouquet/debug", (req, res) => {
  res.json({ draft: req.session.bouquetDraft, session: req.session });
});


module.exports = router;
