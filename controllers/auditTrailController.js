const AuditTrail = require('../models/AuditTrail');

// Récupérer tous les logs d'audit
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await AuditTrail.find();
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des logs', error: err.message });
  }
};
