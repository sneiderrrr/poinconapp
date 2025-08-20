const mongoose = require('mongoose');

const compromeuseSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, trim: true },
  designation: { type: String, required: true, trim: true },
  statut: { type: String, enum: ['actif', 'inactif'], default: 'actif' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Compromeuse', compromeuseSchema);
