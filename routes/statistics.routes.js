const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/StatisticsController'); // Vérifiez ce chemin
const auth = require('../middleware/auth');
const produitController = require('../controllers/produitController'); // Ajout de l'importation du produitController
const { getLoginsByDayAndType } = require('../controllers/StatisticsController');

// Route pour obtenir les statistiques
router.get('/statistics', auth, statisticsController.getStatistics);

router.get('/produits-par-mois', produitController.getProduitsParMois);

// Route pour la répartition des poinçons par forme
router.get('/poincons-par-forme', auth, statisticsController.getPoinconsParForme);

router.get('/user-logins', auth, getLoginsByDayAndType);


module.exports = router;
