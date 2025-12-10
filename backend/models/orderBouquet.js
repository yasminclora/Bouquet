// backend/models/orderBouquet.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("OrderBouquet", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    bouquetId: { type: DataTypes.INTEGER, allowNull: false },
    quantite: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    prixAchat: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 }
  }, {
    tableName: "order_bouquets",
    timestamps: false
  });
};
