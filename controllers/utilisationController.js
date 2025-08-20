const Utilisation = require("../models/Utilisation");

// Génère un numéro unique du type UYYMMNNNN
const generateNumeroUtilisation = async () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const prefix = `U${year}${month}`;

  const lastUtilisation = await Utilisation.findOne({ 
    numeroUtilisation: { $regex: `^${prefix}` } 
  }).sort({ numeroUtilisation: -1 }).exec();

  let newNumber = 1;
  if (lastUtilisation) {
    const lastNumberStr = lastUtilisation.numeroUtilisation.slice(-4);
    newNumber = parseInt(lastNumberStr, 10) + 1;
  }

  const newNumberStr = newNumber.toString().padStart(4, '0');
  return `${prefix}${newNumberStr}`;
};



// Exemple simple de génération de référence automatique (à adapter selon ta logique)
async function generateReference() {
  // Exemple : compter le nombre d'utilisations déjà existantes + 1
  const count = await Utilisation.countDocuments();
  return `REF${count + 1}`; // Par exemple: REF1, REF2, REF3...
}

exports.createUtilisation = async (req, res) => {
  try {
    const numeroUtilisation = await generateNumeroUtilisation();
    const reference = await generateReference(); // référence automatique

    const {
      produit,
      composant,   // Nouveau champ composant ajouté ici
      nbr_lots,
      num_lots,
      nbr_coup_par_poincon,
      etat_livraison,
      etat_retour,
      commentaire,
      date_utilisation,
    } = req.body;

    const utilisation = new Utilisation({
      numeroUtilisation,
      reference,          // référence automatique ici
      produit,
      composant,          // affectation du composant
      nbr_lots: nbr_lots || 0,
      num_lots: num_lots || "",
      nbr_coup_par_poincon: nbr_coup_par_poincon || 0,
      etat_livraison: etat_livraison || "",
      etat_retour: etat_retour || "",
      commentaire: commentaire || "",
      date_utilisation: date_utilisation || new Date(),
      utilisateurs: [req.user.id],
    });

    await utilisation.save();

    const fullUtilisation = await Utilisation.findById(utilisation._id)
      .populate("produit")
      .populate("composant")   // penser à peupler aussi le composant si c'est une ref ObjectId
      .populate("utilisateurs");

    res.status(201).json(fullUtilisation);
  } catch (error) {
    console.error("Erreur lors de la création :", error);
    res.status(400).json({ message: error.message });
  }
};


// Récupérer toutes les utilisations avec relations
exports.getAllUtilisations = async (req, res) => {
  try {
    const utilisations = await Utilisation.find()
      .populate('produit')
      .populate('utilisateurs')
      .exec();
    res.json(utilisations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une utilisation par numeroUtilisation
exports.getUtilisationByNumero = async (req, res) => {
  try {
    const utilisation = await Utilisation.findOne({ numeroUtilisation: req.params.numeroUtilisation })
      .populate('produit')
      .populate('utilisateurs')
      .exec();

    if (!utilisation) {
      return res.status(404).json({ message: "Utilisation non trouvée" });
    }
    res.json(utilisation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mise à jour par numeroUtilisation
exports.updateUtilisation = async (req, res) => {
  try {
    const utilisation = await Utilisation.findOneAndUpdate(
      { numeroUtilisation: req.params.numeroUtilisation },
      req.body,
      { new: true }
    )
    .populate('produit')
    .populate('utilisateurs')
    .exec();

    if (!utilisation) {
      return res.status(404).json({ message: "Utilisation non trouvée" });
    }
    res.json(utilisation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Suppression par numeroUtilisation
exports.deleteUtilisation = async (req, res) => {
  try {
    const utilisation = await Utilisation.findOneAndDelete({ numeroUtilisation: req.params.numeroUtilisation });
    if (!utilisation) {
      return res.status(404).json({ message: "Utilisation non trouvée" });
    }
    res.json({ message: "Utilisation supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
