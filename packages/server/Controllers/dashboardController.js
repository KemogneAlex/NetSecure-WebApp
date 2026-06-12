const logger = require("../utils/logger");
const Dashboard = require("../models/dashboard");

/**
 * Récupère les données pour l'aperçu du tableau de bord.
 * Cette fonction est responsable de la collecte des données nécessaires pour afficher
 * l'aperçu du tableau de bord de l'utilisateur.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 */
exports.getDashboardData = async (req, res) => {
  try {
    // Assurez-vous que l'utilisateur est authentifié et a un ID
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentification requise." });
    }

    // Utilisez l'ID de l'utilisateur pour récupérer ses données de tableau de bord
    const dashboardData = await Dashboard.findOne({ userId: req.user.id });

    if (!dashboardData) {
      return res
        .status(404)
        .json({ message: "Données du tableau de bord non trouvées." });
    }

    logger.info("Données du tableau de bord récupérées avec succès.");
    res.status(200).json({ data: dashboardData });
  } catch (error) {
    logger.error(
      "Erreur lors de la récupération des données du tableau de bord",
      { error: error.toString() }
    );
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des données. Veuillez réessayer ultérieurement.",
    });
  }
};
