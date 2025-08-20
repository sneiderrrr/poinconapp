const mongoose = require('mongoose');

const detailPoinconSchema = new mongoose.Schema({
  poincon: { type: mongoose.Schema.Types.ObjectId, ref: 'Poincon', required: true },
  reference: { type: Number, required: true }, // Ex: 1, 2, 3...
  description: { type: String, default: '' },
});

module.exports = mongoose.model('DetailPoincon', detailPoinconSchema);