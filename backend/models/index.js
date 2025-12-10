// backend/models/index.js
const { Sequelize } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "..", "database.sqlite"),
  logging: false
});

// importer modèles
const User = require("./user")(sequelize);
const Fleur = require("./fleur")(sequelize);
const Bouquet = require("./bouquet")(sequelize);
const BouquetFleur = require("./bouquetFleur")(sequelize);
const Like = require("./like")(sequelize);
const Order = require("./order")(sequelize);
const OrderBouquet = require("./orderBouquet")(sequelize);

// Associations

// Bouquet <-> Fleur (many-to-many) via BouquetFleur (avec quantité)
Bouquet.belongsToMany(Fleur, { through: BouquetFleur, foreignKey: "bouquetId" });
Fleur.belongsToMany(Bouquet, { through: BouquetFleur, foreignKey: "fleurId" });
Bouquet.hasMany(BouquetFleur, { foreignKey: "bouquetId" });
BouquetFleur.belongsTo(Bouquet, { foreignKey: "bouquetId" });
Fleur.hasMany(BouquetFleur, { foreignKey: "fleurId" });
BouquetFleur.belongsTo(Fleur, { foreignKey: "fleurId" });

// User <-> Bouquet (likes) many-to-many via Like
User.belongsToMany(Bouquet, { through: Like, foreignKey: "userId" });
Bouquet.belongsToMany(User, { through: Like, foreignKey: "bouquetId" });
Like.belongsTo(User, { foreignKey: "userId" });
Like.belongsTo(Bouquet, { foreignKey: "bouquetId" });

// Orders
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

Order.belongsToMany(Bouquet, { through: OrderBouquet, foreignKey: "orderId" });
Bouquet.belongsToMany(Order, { through: OrderBouquet, foreignKey: "bouquetId" });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Fleur,
  Bouquet,
  BouquetFleur,
  Like,
  Order,
  OrderBouquet
};
