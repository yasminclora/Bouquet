// server.js
const express = require("express");
const cors = require("cors");

const session = require("express-session");
const path = require("path");
const { sequelize } = require("./models");
const seed = require("./seed");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS pour autoriser les cookies depuis le frontend (http://localhost:3000)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// session (en dev : MemoryStore OK)
app.use(session({
  secret: "123456",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: false,
    sameSite: "lax"
  }
}));

// dossier static pour uploads
//app.use("/uploads", express.static("uploads"));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// routes (assure-toi d'exporter correctement les routers)
app.use("/api/bouquets", require("./routes/bouquetRoutes"));
app.use("/api/fleurs", require("./routes/fleurRoutes"));





const utilisateurRoutes = require("./routes/utilisateur.routes");
app.use("/api/utilisateurs", utilisateurRoutes);


app.use("/api/orders", require("./routes/orderRoutes"));



const sessionRoutes = require("./routes/sessionRoutes");
app.use("/backoffice/session", sessionRoutes);

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await seed();
    app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));
  } catch (err) {
    console.error("Erreur démarrage serveur :", err);
    process.exit(1);
  }
})();






app.get("/test-session", (req, res) => {
  if (!req.session.test) req.session.test = 0;
  req.session.test++;
  res.json({ test: req.session.test });
});
