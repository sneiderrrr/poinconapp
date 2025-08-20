const mongoose = require('mongoose');

const poinconSchema = new mongoose.Schema({
  codeFormat: { type: String, required: true, unique: true },
  forme: { type: String, required: true },   // changé de ObjectId à String
  fournisseur: { type: mongoose.Schema.Types.ObjectId, ref: 'Fournisseur', required: true },
  marque: { type: mongoose.Schema.Types.ObjectId, ref: 'Marque', required: true },
  nbrComposants: { type: Number, default: 1 },
  ficheTechnique: { type: String },
  statut: { type: String, default: 'actif' },
  etat: { type: String },   // changé de ObjectId à String
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Poincon', poinconSchema);
