const router = require("express").Router();
const ctrl = require("../controllers/fleurController");
router.get("/", ctrl.getAll);
router.post("/", ctrl.create);


router.delete("/:id", ctrl.deleteFlower);


module.exports = router;
