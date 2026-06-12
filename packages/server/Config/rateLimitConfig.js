/**
 * @description      :
 * @author           : kemogne
 * @group            :
 * @created          : 14/06/2024 - 21:56:26
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 14/06/2024
 * - Author          : kemogne
 * - Modification    :
 **/
const rateLimit = require("express-rate-limit");

// Créer une fonction de réponse personnalisée pour gérer les dépassements de limite
const limitReachedHandler = (req, res) => {
  res.status(429).json({
    success: false,
    message:
      "Trop de requêtes depuis cette IP, veuillez réessayer après 15 minutes",
  });
};

const rateLimitConfig = rateLimit({
  windowMs: 15 * 60 * 1000, // Fenêtre de 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre
  handler: limitReachedHandler, // Utiliser la fonction de réponse personnalisée
  // Ajouter des en-têtes HTTP pour fournir des informations sur l'état de la limite
  standardHeaders: true, // Retourner les informations de limite de taux dans les en-têtes `RateLimit-*`
  legacyHeaders: false, // Désactiver les en-têtes `X-RateLimit-*`
});

module.exports = rateLimitConfig;
