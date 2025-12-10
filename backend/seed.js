// backend/seed.js
const { User, Fleur, Bouquet, BouquetFleur, sequelize } = require("./models");

async function seed() {
  await sequelize.sync(); // crée les tables s'il le faut

  // Utilisateurs de test (findOrCreate pour ne pas écraser)
  await User.findOrCreate({ where: { login: "admin" }, defaults: { password: "admin123", fullName: "Admin Test" }});
  await User.findOrCreate({ where: { login: "client" }, defaults: { password: "client123", fullName: "Client Test" }});

  // Fleurs
  const [rose] = await Fleur.findOrCreate({ where: { nom: "Rose" }, defaults: { description: "Rose classique", prixUnitaire: 50 }});
  const [lys] = await Fleur.findOrCreate({ where: { nom: "Lys" }, defaults: { description: "Lys blanc", prixUnitaire: 80 }});
  const [jasmin] = await Fleur.findOrCreate({ where: { nom: "Jasmin" }, defaults: { description: "Parfumé", prixUnitaire: 40 }});

  // Exemple de bouquet (si non existant)
  const [b1, created] = await Bouquet.findOrCreate({
    where: { nom: "Bouquet Classique" },
    defaults: { description: "Mix roses et lys", image: "/images/b1.jpg" }
  });

  if (created) {
    // attacher fleur + quantite + sauvegarder prix unitaire
    await BouquetFleur.create({ bouquetId: b1.id, fleurId: rose.id, quantite: 5, prixUnitaireSauvegarde: rose.prixUnitaire });
    await BouquetFleur.create({ bouquetId: b1.id, fleurId: lys.id, quantite: 2, prixUnitaireSauvegarde: lys.prixUnitaire });
    // calcul prix total
    const total = 5 * rose.prixUnitaire + 2 * lys.prixUnitaire;
    b1.prixTotal = total;
    await b1.save();
  }

  console.log("Seed terminé.");
}

module.exports = seed;
