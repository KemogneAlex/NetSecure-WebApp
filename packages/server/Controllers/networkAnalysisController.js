// networkAnalysisController.js
const NetworkAnalyzer = require("../services/NetworkAnalyzer");
const logger = require("../utils/logger");

// Fonction pour exécuter l'analyse de réseau
exports.runNetworkAnalysis = async (req, res) => {
  try {
    // Vérifiez que l'utilisateur est authentifié et possède un identifiant valide
    if (
      !req.user ||
      typeof req.user.id !== "string" ||
      req.user.id.trim() === ""
    ) {
      logger.warn("Tentative d’accès sans authentification valide.");

      return res.status(401).json({ message: "Authentification requise." });
    }

    // Exécutez l'analyse de réseau en utilisant le service dédié
    const analysisResults = await NetworkAnalyzer.analyze(req.user.id);

    logger.info(`Analyse de réseau exécutée pour l'utilisateur ${req.user.id}`);

    res.status(200).json({ analysis: analysisResults });
  } catch (error) {
    logger.error("Erreur lors de l’exécution de l’analyse de réseau", {
      error: error.message,
    });

    res.status(500).json({
      message:
        "Un problème est survenu avec le service d’analyse de réseau. Nous travaillons à résoudre ce problème.",
    });
  }
};
