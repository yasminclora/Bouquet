// backend/models/order.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Order", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    total: { type: DataTypes.FLOAT, defaultValue: 0 }
  }, {
    tableName: "orders",
    timestamps: true
  });
};
