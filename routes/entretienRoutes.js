const express = require('express');
const router = express.Router();
const entretienController = require('../controllers/entretienController');
const verifyToken = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

// Toutes les routes sont protégées par auth middleware
router.use(verifyToken);

// Routes CRUD avec vérification des permissions par rôle
router.post('/', checkPermission('entretiens', 'create'), entretienController.createEntretien);
router.get('/', checkPermission('entretiens', 'read'), entretienController.getEntretiens);
router.get('/:id', checkPermission('entretiens', 'read'), entretienController.getEntretienById);
router.put('/:id', checkPermission('entretiens', 'update'), entretienController.updateEntretien);
router.delete('/:id', checkPermission('entretiens', 'delete'), entretienController.deleteEntretien);

module.exports = router;
