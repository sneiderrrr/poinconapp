const DetailPoincon = require("../models/DetailPoincon");

// 📌 GET - Récupérer tous les détails d’un poinçon donné
exports.getDetailsByPoincon = async (req, res) => {
  try {
    const { poinconId } = req.params;

    const details = await DetailPoincon.find({ poincon: poinconId })
      .populate("poincon", "codeFormat"); // si tu veux aussi renvoyer info du poinçon

    if (!details.length) {
      return res.status(404).json({ message: "Aucun détail trouvé pour ce poinçon" });
    }

    res.status(200).json(details);
  } catch (error) {
    console.error("Erreur récupération détails poinçon:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 📌 DELETE - Supprimer un détail de poinçon par son ID
exports.deleteDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDetail = await DetailPoincon.findByIdAndDelete(id);

    if (!deletedDetail) {
      return res.status(404).json({ message: "Détail poinçon non trouvé" });
    }

    res.status(200).json({ message: "Détail poinçon supprimé avec succès" });
  } catch (error) {
    console.error("Erreur suppression détail poinçon:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
