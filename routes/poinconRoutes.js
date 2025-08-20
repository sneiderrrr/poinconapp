const express = require('express');
const router = express.Router();
const poinconController = require('../controllers/poinconController');
const auth = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');
const fs = require('fs');
const multer = require("multer");
const path = require("path");

// Chemin absolu vers le dossier upload
const uploadDir = path.join(__dirname, '..', 'uploads', 'ficheTechniques');

// Création du dossier s'il n'existe pas
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

// Appliquer le middleware d'authentification à toutes les routes
router.use(auth);

router.post(
  "/",
  checkPermission("poincons", "create"),
  upload.single("ficheTechnique"),
  poinconController.createPoincon
);

router.get('/', checkPermission('poincons', 'read'), poinconController.getPoincons);
router.get('/:id', checkPermission('poincons', 'read'), poinconController.getPoinconById);
router.put('/:id', checkPermission('poincons', 'update'), poinconController.updatePoincon);
router.delete('/:id', checkPermission('poincons', 'delete'), poinconController.deletePoincon);

module.exports = router;
