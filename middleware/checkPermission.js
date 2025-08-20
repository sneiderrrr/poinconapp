const Etatpoincon = require("../models/Etatpoincon");

const permissions = {
  Administrateur: {
    users: ['create', 'read', 'update', 'delete'],
    produits: ['create', 'read', 'update', 'delete'],
    poincons: ['create', 'read', 'update', 'delete'],
    fournisseurs: ['create', 'read', 'update', 'delete'],
    marques: ['create', 'read', 'update', 'delete'],
    etatpoincons: ['create', 'read', 'update', 'delete'], 
    formes: ['create', 'read', 'update', 'delete'], 
  },
  Superviseur: {
    users: ['read'],
    produits: ['read'],
    poincons: ['read'],
    fournisseurs: ['read'],
    marques: ['read'],
    etatpoincons: ['read'],
    formes: ['read'], 

  },
  Agent: {
    users: [],
    produits: ['read'],
    poincons: [],
    fournisseurs: [],
    marques: [],
    etatpoincons: [],
    formes: ['read'], 

  },
};

module.exports = function (moduleName, action) {
  return (req, res, next) => {
    const role = req.user.role;
    const allowedActions = permissions[role]?.[moduleName] || [];

    if (allowedActions.includes(action)) {
      next();
    } else {
      res.status(403).json({ message: 'Permission refusée' });
    }
  };
};
