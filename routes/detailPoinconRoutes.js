const express = require("express");
const router = express.Router();
const detailPoinconController = require("../controllers/DetailPoinconController");

// Récupérer tous les détails d’un poinçon
router.get("/:poinconId", detailPoinconController.getDetailsByPoincon);

// Supprimer un détail de poinçon
router.delete("/:id", detailPoinconController.deleteDetail);

module.exports = router;
