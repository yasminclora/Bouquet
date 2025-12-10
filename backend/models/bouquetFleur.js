// backend/models/bouquetFleur.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("BouquetFleur", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    bouquetId: { type: DataTypes.INTEGER, allowNull: false },
    fleurId: { type: DataTypes.INTEGER, allowNull: false },
    quantite: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    prixUnitaireSauvegarde: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 }
  }, {
    tableName: "bouquet_fleurs",
    timestamps: false
  });
};
