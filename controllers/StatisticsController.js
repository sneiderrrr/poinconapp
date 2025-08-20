// controllers/statisticsController.js
const Produit = require('../models/Produit');
const Fournisseur = require('../models/Fournisseur');
const Poincon = require('../models/Poincon');
const User = require('../models/User');
const Forme = require('../models/Forme'); // déjà présent ? sinon ajoute-le
const HistoriqueConnexion = require('../models/HistoriqueConnexion');


exports.getStatistics = async (req, res) => {
  try {
    // Calcul des statistiques des produits
    const totalProduits = await Produit.countDocuments();
    const produitsActifs = await Produit.countDocuments({ statut: 'actif' });
    const produitsInactifs = await Produit.countDocuments({ statut: 'inactif' });

    // Calcul des statistiques des fournisseurs
    const totalFournisseurs = await Fournisseur.countDocuments();
    const fournisseursActifs = await Fournisseur.countDocuments({ statut: 'actif' });

    // Calcul des statistiques des poinçons
    const totalPoincons = await Poincon.countDocuments();
    const poinconsActifs = await Poincon.countDocuments({ statut: 'actif' });

    // Calcul des statistiques des utilisateurs
    const totalUtilisateurs = await User.countDocuments();
    const utilisateursActifs = await User.countDocuments({ statut: 'actif' });

    // Renvoyer les statistiques
    res.status(200).json({
      totalProduits,
      produitsActifs,
      produitsInactifs,
      totalFournisseurs,
      fournisseursActifs,
      totalPoincons,
      poinconsActifs,
      totalUtilisateurs,
      utilisateursActifs,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
exports.getPoinconsParForme = async (req, res) => {
  try {
    const match = {};
    if (req.query.fournisseur) {
      match.fournisseur = req.query.fournisseur;
    }

    const aggregation = await Poincon.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$forme",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          forme: "$_id",
          count: 1
        }
      }
    ]);

    res.status(200).json(aggregation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getLoginsByDayAndType = async (req, res) => {
  try {
    const data = await HistoriqueConnexion.aggregate([
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$dateConnexion" } },
            role: "$role"
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.date": 1 } }
    ]);

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
