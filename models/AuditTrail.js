const mongoose = require("mongoose");

const auditTrailSchema = new mongoose.Schema({
  actionType: {
    type: String, // Ajout, modification, suppression, etc.
    required: true
  },
  reference: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Fournisseur" // Référence à un modèle spécifique (ex: Fournisseur, User, etc.)
  },
  actionDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Utilisateur qui a effectué l'action
    required: true
  },
  description: {
    type: String, // Description optionnelle de l'action
    default: ""
  }
});

module.exports = mongoose.model("AuditTrail", auditTrailSchema);
