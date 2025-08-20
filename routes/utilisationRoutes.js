const express = require('express');
const router = express.Router();
const utilisationController = require('../controllers/utilisationController');
const auth = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

router.use(auth);

router.post('/', checkPermission('utilisations', 'create'), utilisationController.createUtilisation);
router.get('/', checkPermission('utilisations', 'read'), utilisationController.getAllUtilisations);
router.get('/:numeroUtilisation', checkPermission('utilisations', 'read'), utilisationController.getUtilisationByNumero);
router.put('/:numeroUtilisation', checkPermission('utilisations', 'update'), utilisationController.updateUtilisation);
router.delete('/:numeroUtilisation', checkPermission('utilisations', 'delete'), utilisationController.deleteUtilisation);

module.exports = router;
