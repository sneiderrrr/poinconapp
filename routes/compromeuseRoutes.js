const express = require('express');
const router = express.Router();
const compromeuseController = require('../controllers/compromeuseController');
const verifyToken = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

// CRUD des compromeuses
router.post('/', verifyToken, checkPermission('compromeuses', 'create'), compromeuseController.createCompromeuse);
router.get('/', verifyToken, checkPermission('compromeuses', 'read'), compromeuseController.getCompromeuses);
router.get('/:id', verifyToken, checkPermission('compromeuses', 'read'), compromeuseController.getCompromeuseById);
router.put('/:id', verifyToken, checkPermission('compromeuses', 'update'), compromeuseController.updateCompromeuse);
router.delete('/:id', verifyToken, checkPermission('compromeuses', 'delete'), compromeuseController.deleteCompromeuse);

module.exports = router;
