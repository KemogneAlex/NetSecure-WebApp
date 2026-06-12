const jwt = require("jsonwebtoken");
const logger = require("..utils/logger");
const { userHasPermission } = require("../utils/validation");

/**
 * Middleware pour authentifier l'utilisateur en vérifiant le token JWT.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @param {Function} next - La fonction callback pour passer au prochain middleware.
 */
const authenticateUser = (req, res, next) => {
  try {
    // Récupérer le token du header d'autorisation
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      // Si le header d'autorisation est absent, renvoyer une erreur 401
      logger.warn("Tentative d'accès sans token");
      return res.status(401).json({ message: "Authentification requise" });
    }

    // Extraire le token après le mot-clé 'Bearer'
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      // Si le format du token n'est pas correct, renvoyer une erreur 401
      logger.warn("Format d'autorisation incorrect");
      return res.status(401).json({ message: "Authentification requise" });
    }

    // Le token est la deuxième partie du header d'autorisation
    const token = parts[1];

    // Vérifier le token avec la clé secrète définie dans les variables d'environnement
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Attacher les informations de l'utilisateur décodées à l'objet req pour les utiliser dans les routes protégées
    req.user = { userId: decodedToken.userId };
    next();
  } catch (error) {
    // En cas d'erreur lors de la vérification du token, logger l'erreur et renvoyer une erreur 401
    logger.error("Erreur d'authentification", { error: error.message });
    res.status(401).json({ message: "Non authentifié" });
  }
};

// Middleware pour vérifier les permissions d'un utilisateur
function checkPermission(action) {
  return (req, res, next) => {
    if (!req.user || !userHasPermission(req.user, action)) {
      return res.status(403).json({ message: "Accès refusé" });
    }
    next();
  };
}

module.exports = { authenticateUser, checkPermission };
