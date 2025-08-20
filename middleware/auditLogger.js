const AuditTrail = require('../models/AuditTrail'); // Assure-toi que le chemin est correct

// Fonction pour loguer les actions
const logAuditTrail = async (req, actionType, reference, description) => {
  const auditLog = new AuditTrail({
    actionType,
    reference,
    user: req.user.id,  // Utilisateur connecté
    description,
    module: 'poincon',  // Optionnel : Indique quel module a effectué l'action
  });

  try {
    await auditLog.save();
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'AuditTrail", error);
  }
};

module.exports = logAuditTrail;
