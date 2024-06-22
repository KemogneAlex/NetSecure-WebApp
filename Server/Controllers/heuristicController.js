const logger = require("../utils/logger");
const DOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

const maxLoginAttempts = 5; // Nombre maximum de tentatives de connexion autorisées
const loginAttemptWindow = 900; // Fenêtre de temps en secondes (15 minutes)
const usersLoginAttempts = new Map(); // Stocke les tentatives de connexion pour chaque utilisateur

/**
 * Nettoie l'entrée potentiellement dangereuse pour éviter les attaques XSS.
 * @param {Object} input - Données potentiellement dangereuses provenant de la requête.
 * @returns {Object} - Données nettoyées et sécurisées.
 */
function sanitizeInput(input) {
  // Créez une fenêtre JSDOM pour DOMPurify
  const window = new JSDOM("").window;
  // Créez une version de DOMPurify pour cette fenêtre
  const purify = DOMPurify(window);

  // Nettoyez chaque propriété de l'objet d'entrée
  for (const property in input) {
    if (input.hasOwnProperty(property) && typeof input[property] === "string") {
      // Nettoyez les valeurs de type string avec DOMPurify pour éviter les attaques XSS
      input[property] = purify.sanitize(input[property]);
      // Pour les injections SQL, utilisez des requêtes préparées dans la partie de la base de données
    }
  }

  return input; // Retourne l'entrée nettoyée
}
module.exports = { sanitizeInput };

/**
 * Applique des règles heuristiques pour la détection d'intrusions.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 */
exports.applyHeuristicRules = async (req, res) => {
  try {
    const requestData = req.body; // Analysez les données du corps de la requête de manière sécurisée
    const cleanData = sanitizeInput(requestData); // Nettoyez les données d'entrée potentiellement dangereuses

    // Règle heuristique pour la détection d'injection XSS
    const xssPattern = /<script.*?>.*?<\/script>/i;
    if (xssPattern.test(cleanData)) {
      logger.warn("Tentative d'injection XSS détectée", { data: cleanData });
      res.status(403).json({
        message: "Accès refusé en raison d'une tentative d'injection XSS.",
      });
      return;
    }

    // Règle heuristique pour la détection d'injection SQL
    const sqlInjectionPattern = /('|").*(OR|AND).*('|")/i;
    if (sqlInjectionPattern.test(cleanData)) {
      logger.warn("Tentative d'injection SQL détectée", { data: cleanData });
      res.status(403).json({
        message: "Accès refusé en raison d'une tentative d'injection SQL.",
      });
      return;
    }

    // Détection de tentative de force brute
    if (isBruteForceAttemptDetected(req)) {
      logger.warn("Tentative de force brute détectée");
      res.status(403).json({
        message: "Accès refusé en raison d'une tentative de force brute.",
      });
      return;
    }

    // Implémentez d'autres règles heuristiques ici si nécessaire

    // Si aucune anomalie n'est détectée, envoyez une réponse positive
    logger.info("Les règles heuristiques ont été appliquées avec succès.");
    res.status(200).json({
      message: "La vérification de sécurité a été effectuée avec succès.",
    });
  } catch (error) {
    logger.error("Erreur lors de l'application des règles heuristiques", {
      error: error.message,
    });
    res.status(500).json({
      message:
        "Un problème est survenu lors du traitement de votre demande. Veuillez réessayer plus tard.",
    });
  }
};
/**
 * Vérifie si une tentative de force brute est détectée.
 * @param {Object} req - L'objet de requête HTTP.
 * @returns {boolean} - true si une tentative de force brute est détectée, sinon false.
 */
function isBruteForceAttemptDetected(req) {
  // Vérifiez si l'utilisateur est défini et a un identifiant
  if (!req.user || !req.user.id) {
    // Gérez l'erreur ou renvoyez false si l'utilisateur n'est pas authentifié
    logger.error(
      "L'utilisateur n'est pas authentifié ou l'ID utilisateur est manquant."
    );
    return false;
  }

  const userId = req.user.id; // Identifiant unique de l'utilisateur
  const currentTime = Math.floor(Date.now() / 1000); // Temps actuel en secondes

  if (!usersLoginAttempts.has(userId)) {
    // Si l'utilisateur n'est pas encore enregistré, initialisez son compteur
    usersLoginAttempts.set(userId, { count: 1, startTime: currentTime });
    return false;
  }

  const userData = usersLoginAttempts.get(userId);
  const timeElapsed = currentTime - userData.startTime;

  if (timeElapsed < loginAttemptWindow) {
    // Si nous sommes toujours dans la fenêtre de temps actuelle
    userData.count++;
    if (userData.count > maxLoginAttempts) {
      // Si l'utilisateur a dépassé le nombre maximum de tentatives
      return true;
    }
  } else {
    // Si la fenêtre de temps est dépassée, réinitialisez le compteur
    usersLoginAttempts.set(userId, { count: 1, startTime: currentTime });
  }

  return false;
}
