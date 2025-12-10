// backend/routes/bouquetRoutes.js
const express = require("express");
const router = express.Router();
const bouquetCtrl = require("../controllers/bouquetController");
const { Bouquet } = require("../models"); 

router.get("/", bouquetCtrl.getAll);
router.get("/:id", bouquetCtrl.getOne);
router.post("/complet", bouquetCtrl.createBouquetComplet); // crée bouquet + fleurs (body contient fleurs avec id ou nom + quantite)


//router.post("/:id/like", bouquetCtrl.likeBouquet); // body: { userId }



// backend/routes/bouquet.routes.js
router.post("/:id/like", bouquetCtrl.likeBouquet);


router.delete("/:id", bouquetCtrl.deleteBouquet);


module.exports = router;
