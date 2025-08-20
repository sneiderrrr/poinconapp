// middleware/checkPermission.js
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ton modèle User (Mongoose ou autre)

// Middleware qui vérifie les permissions
function checkPermission(moduleName, action) {
  return async (req, res, next) => {
    try {
      // Récupérer le token depuis les headers
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Token manquant ❌" });
      }

      // Vérifier et décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Charger l'utilisateur depuis la BDD
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "Utilisateur introuvable ❌" });
      }

      // Vérifier les permissions de l'utilisateur
      if (
        user.permissions &&
        user.permissions[moduleName] &&
        user.permissions[moduleName].includes(action)
      ) {
        req.user = user; // On injecte l'utilisateur pour la suite
        return next();
      }

      // Si pas de permission
      return res.status(403).json({ message: "Permission refusée 🚫" });
    } catch (error) {
      console.error("Erreur middleware checkPermission:", error);
      return res.status(401).json({ message: "Token invalide ❌" });
    }
  };
}

module.exports = checkPermission;
