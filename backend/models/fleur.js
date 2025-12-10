// backend/models/fleur.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Fleur", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nom: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    prixUnitaire: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 }
  }, {
    tableName: "fleurs",
    timestamps: true
  });
};
