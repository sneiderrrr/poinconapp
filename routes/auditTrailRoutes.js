const express = require('express');
const router = express.Router();
const auditTrailController = require('../controllers/auditTrailController');  // Assurez-vous que le chemin est correct

// Route pour obtenir les logs d'audit
router.get('/', auditTrailController.getAllLogs);

module.exports = router;
