const express = require("express");
const router = express.Router();
const controller = require("../controllers/entretienController");

router.post("/", controller.createEntretien);
router.get("/", controller.getEntretiens);
// router.put("/:id", controller.updateEntretien);
// router.delete("/:id", controller.deleteEntretien);

module.exports = router;
