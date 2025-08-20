const mongoose = require('mongoose');

const entretienSchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true },

  date: { type: Date, required: true },

  utilisateurs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],

   referenceUtilisation: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisation' },

  produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit', required: true }, // 🔗 relation ajoutée

  nettoyage: {
    date: { type: Date, required: true },
    produit: { type: String, required: true }
  },

  lubrification: {
    date: { type: Date, required: true },
    produit: { type: String, required: true }
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Entretien', entretienSchema);
