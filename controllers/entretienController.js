const Entretien = require("../models/Entretien");

exports.createEntretien = async (req, res) => {
  console.log("➡️ Données reçues pour création :", req.body); // 🧪 LOG
  try {
    const newEntretien = new Entretien(req.body);
    const saved = await newEntretien.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("💥 Erreur création entretien :", err); // 🧪 LOG
    res.status(500).json({ message: "Erreur création entretien", error: err.message });
  }
};

exports.getEntretiens = async (req, res) => {
  try {
    console.log("📥 Tentative récupération entretiens...");

    const entretiens = await Entretien.find()
      .populate({ path: "produit", options: { strictPopulate: false } })
      .populate({ path: "utilisateur", options: { strictPopulate: false } });

    console.log("✅ Nombre d'entretiens récupérés:", entretiens.length);
    res.status(200).json(entretiens);
  } catch (error) {
    console.error("💥 Erreur dans getEntretiens:");
    console.error(error); // 👈 NE PAS résumer, on veut tout afficher
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};




