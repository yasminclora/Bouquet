// backend/models/bouquet.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Bouquet", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nom: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    image: { type: DataTypes.STRING }, // chemin / url
    prixTotal: { type: DataTypes.FLOAT, defaultValue: 0 }, // calculé au moment de la création
    likesCount: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    tableName: "bouquets",
    timestamps: true
  });
};
