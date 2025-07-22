const HistoriqueConnexion = require('../models/HistoriqueConnexion');

// Récupérer tout l'historique
exports.getHistorique = async (req, res) => {
  try {
    const data = await HistoriqueConnexion.find().sort({ dateConnexion: -1 }); // du plus récent au plus ancien
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération de l'historique",
      error: err.message,
    });
  }
};

// Supprimer une entrée par ID
exports.deleteHistorique = async (req, res) => {
  try {
    const deleted = await HistoriqueConnexion.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Entrée non trouvée" });
    }
    res.status(200).json({ message: 'Entrée supprimée avec succès' });
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la suppression",
      error: err.message,
    });
  }
};

// Supprimer tout l'historique
exports.clearHistorique = async (req, res) => {
  try {
    await HistoriqueConnexion.deleteMany({});
    res.status(200).json({ message: 'Historique entièrement vidé' });
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors du nettoyage de l'historique",
      error: err.message,
    });
  }
};
