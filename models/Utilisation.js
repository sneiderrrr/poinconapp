const mongoose = require("mongoose");
const { Schema } = mongoose;

const UtilisationSchema = new Schema({
  numeroUtilisation: { type: String, required: true, unique: true },
  reference: { type: String, required: true, unique: true },
  date_utilisation: { type: Date, default: Date.now },
    composant: { type: Schema.Types.ObjectId, ref: 'DetailPoincon', required: true },  // <-- Ici !

  produit: { type: Schema.Types.ObjectId, ref: "Produit", required: true },
  utilisateurs: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  nbr_lots: { type: Number, default: 0 },
  num_lots: { type: String },
  nbr_coup_par_poincon: { type: Number, default: 0 },
  etat_livraison: { type: String },
  etat_retour: { type: String },
  commentaire: { type: String }
});

// 🔹 Génération automatique de la référence
UtilisationSchema.pre("save", async function (next) {
  if (!this.reference) {
    // Exemple : UTI-2025-0001
    const year = new Date().getFullYear();
    const lastUtilisation = await mongoose.model("Utilisation").findOne().sort({ _id: -1 });

    let nextNumber = 1;
    if (lastUtilisation) {
      const lastRef = lastUtilisation.reference.split("-").pop();
      nextNumber = parseInt(lastRef, 10) + 1;
    }

    this.reference = `UTI-${year}-${String(nextNumber).padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Utilisation", UtilisationSchema);