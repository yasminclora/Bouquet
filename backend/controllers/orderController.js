const { Order, OrderBouquet, Bouquet, sequelize } = require("../models");

exports.createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { userId, bouquets } = req.body;
    if (!userId || !Array.isArray(bouquets) || bouquets.length === 0) return res.status(400).json({ message: "Données invalides" });

    let total = 0;
    const order = await Order.create({ userId, total: 0 }, { transaction: t });

    for (const b of bouquets) {
      const bouquet = await Bouquet.findByPk(b.bouquetId);
      if (!bouquet) { await t.rollback(); return res.status(404).json({ message: "Bouquet non trouvé" }); }
      const quantite = b.quantite || 1;
      const prixAchat = bouquet.prixTotal || 0;
      await OrderBouquet.create({ orderId: order.id, bouquetId: bouquet.id, quantite, prixAchat }, { transaction: t });
      total += quantite * prixAchat;
    }

    order.total = total;
    await order.save({ transaction: t });
    await t.commit();
    res.status(201).json({ message: "Commande créée", orderId: order.id });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ err });
  }
};
