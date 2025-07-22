const express = require('express');
const { getHistorique, deleteHistorique, clearHistorique } = require('../controllers/historiqueController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, getHistorique);
router.delete('/:id', verifyToken, deleteHistorique);
router.delete('/', verifyToken, clearHistorique); // vider tout

module.exports = router;
