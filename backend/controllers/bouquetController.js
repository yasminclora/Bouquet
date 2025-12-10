
const { Bouquet, Fleur, BouquetFleur, Like, User, sequelize } = require("../models");

exports.getAll = async (req, res) => {
  try {
    const bouquets = await Bouquet.findAll({
      include: [
        {
          model: BouquetFleur,
          include: [Fleur]
        },
        {
          model: User,
          through: { attributes: [] } // likes
        }
      ]
    });

    res.json(bouquets);
  } catch (err) {
    res.status(500).json({ message: "Erreur getAll", err });
  }
};






exports.getOne = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const bouquet = await Bouquet.findByPk(id, {
      include: [{ model: BouquetFleur, include: [Fleur] }, { model: User, through: { attributes: [] } }]
    });
    if (!bouquet) return res.status(404).json({ message: "Non trouvé" });
    res.json(bouquet);
  } catch (err) {
    res.status(500).json({ message: "Erreur getOne", err });
  }
};



exports.createBouquetComplet = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    //  ON RÉCUPÈRE BIEN TOUT : NOM + DESCRIPTION + FLEURS
    const { nom, description, fleurs } = req.body;

    if (!nom || !description) {
      return res.status(400).json({ message: "Nom et description requis" });
    }

    if (!fleurs || fleurs.length === 0) {
      return res.status(400).json({ message: "Aucune fleur fournie" });
    }

    //  IMAGE
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    //  creer BOUQUET
    const bouquet = await Bouquet.create(
      {
        nom,
        descr: description,
        image: imagePath
      },
      { transaction: t }
    );

    //  AJOUT DES FLEURS
    let total = 0;

    const fleursArray = Array.isArray(fleurs) ? fleurs : JSON.parse(fleurs);

    for (const f of fleursArray) {
      const fleur = await Fleur.findByPk(f.fleurId);
      if (!fleur) continue;

      const quantite = parseInt(f.quantite);
      const prixUnitaire = fleur.prixUnitaire;

      await BouquetFleur.create(
        {
          bouquetId: bouquet.id,
          fleurId: fleur.id,
          quantite,
          prixUnitaireSauvegarde: prixUnitaire
        },
        { transaction: t }
      );

      total += quantite * prixUnitaire;
    }

    //  SAUVEGARDE DU PRIX TOTAL
    bouquet.prixTotal = total;
    await bouquet.save({ transaction: t });

    await t.commit();

    return res.status(201).json({
      message: "Bouquet créé avec succès",
      bouquet
    });

  } catch (err) {
    await t.rollback();
    console.error("Erreur création bouquet :", err);
    res.status(500).json({ message: "Erreur création bouquet", err });
  }
};





exports.deleteBouquet = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Bouquet.destroy({ where: { id } });
    if (!result) return res.status(404).json({ message: "Bouquet introuvable" });
    res.json({ message: "Bouquet supprimé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur suppression bouquet", err });
  }
};






exports.likeBouquet = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Non connecté" });
    }

    const userId = req.session.user.id;
    const { id } = req.params;

    const bouquet = await Bouquet.findByPk(id);
    if (!bouquet) {
      return res.status(404).json({ message: "Bouquet introuvable" });
    }

    // Vérifier si l'utilisateur a déjà liké
    const existing = await bouquet.hasUser(userId);

    if (existing) {
      await bouquet.removeUser(userId);
      return res.json({ liked: false, message: "Like retiré" });
    } else {
      await bouquet.addUser(userId);
      return res.json({ liked: true, message: "Like ajouté" });
    }
  } catch (err) {
    console.error("Erreur like :", err);
    res.status(500).json({ message: "Erreur lors du like" });
  }
};