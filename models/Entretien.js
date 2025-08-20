const mongoose = require("mongoose");

const entretienSchema = new mongoose.Schema({
  reference: { type: String, required: true },
  date: { type: Date, required: true },
  utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  produit: { type: mongoose.Schema.Types.ObjectId, ref: "Produit", required: true }, // ✅ AJOUT ICI
  referenceUtilisation: { type: String },

  nettoyage: {
    date: Date,
    produit: String,
  },
  lubrification: {
    date: Date,
    produit: String,
  },

  commentaire: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Entretien", entretienSchema);
