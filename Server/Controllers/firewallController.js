const FirewallService = require("../services/firewallService");
const logger = require("../utils/logger");
const { sanitizeInput } = require("./heuristicController");

/**
 * Récupère les règles du pare-feu.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 */
exports.getFirewallRules = async (req, res) => {
  try {
    const userId = req.user.id;

    const rules = await FirewallService.getFirewallRules(userId);
    logger.info("Règles du pare-feu récupérées avec succès.");
    res.status(200).json({ rules });
  } catch (error) {
    logger.error("Erreur lors de la récupération des règles du pare-feu", {
      error: error.toString(),
    });
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des données. Veuillez réessayer ultérieurement.",
    });
  }
};

/**
 * Met à jour les règles du pare-feu.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 */
exports.updateFirewallRules = async (req, res) => {
  try {
    const sanitizedData = sanitizeInput(req.body); // Nettoyer les données d'entrée
    await FirewallService.updateFirewallRules(sanitizedData.rules);
    logger.info("Les règles du pare-feu ont été mises à jour.");
    res.status(200).json({
      message:
        "La mise à jour des règles du pare-feu a été effectuée avec succès.",
    });
  } catch (error) {
    logger.error("Erreur lors de la mise à jour des règles du pare-feu", {
      error: error.toString(),
    });
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la mise à jour. Veuillez réessayer ultérieurement.",
    });
  }
};
