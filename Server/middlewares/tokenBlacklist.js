const NodeCache = require("node-cache");
const tokenBlacklist = new NodeCache({ stdTTL: 3600 }); // Les tokens sont conservés pendant 1 heure

const blacklistToken = (token) => {
  // Stocker le token dans la liste noire avec une valeur arbitraire, par exemple true
  tokenBlacklist.set(token, true);
};

// Fonction pour vérifier si un token est dans la liste noire
const isTokenBlacklisted = (token) => {
  return tokenBlacklist.has(token);
};

module.exports = {
  blacklistToken,
  isTokenBlacklisted,
};
