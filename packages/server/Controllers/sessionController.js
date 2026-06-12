const Session = require("../models/Session");
const logger = require("../utils/logger");

// Récupère les sessions actives de l'utilisateur
exports.getActiveSessions = async (req, res) => {
  try {
    const userId = req.user._id;

    // Valider l'ID de l'utilisateur
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      logger.warn(
        `Tentative de récupération de sessions actives avec un ID utilisateur invalide : ${userId}`
      );
      return res.status(400).json({ message: "ID utilisateur invalide" });
    }

    // Recherche des sessions actives de l'utilisateur actuel
    const activeSessions = await Session.find({ user: userId, isActive: true });

    // Vérifier si des sessions actives existent
    if (!activeSessions.length) {
      logger.info(`Aucune session active trouvée pour l'utilisateur ${userId}`);
      return res.status(404).json({ message: "Aucune session active trouvée" });
    }

    res.status(200).json(activeSessions);
  } catch (error) {
    logger.error(
      "Erreur serveur lors de la récupération des sessions actives.",
      { error: error.message }
    );
    res.status(500).json({
      message: "Erreur serveur lors de la récupération des sessions actives.",
    });
  }
};

// Ferme une session spécifique
exports.closeSession = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;

    // Valider l'ID de la session
    if (!sessionId.match(/^[0-9a-fA-F]{24}$/)) {
      logger.warn(
        `Tentative de fermeture de session avec un ID invalide : ${sessionId}`
      );
      return res.status(400).json({ message: "ID de session invalide" });
    }

    // Recherche de la session spécifique de l'utilisateur actuel
    const session = await Session.findOne({
      _id: sessionId,
      user: req.user._id,
    });

    // Vérification de l'existence de la session
    if (!session) {
      logger.info(`Session non trouvée pour l'ID : ${sessionId}`);
      return res.status(404).json({ message: "Session non trouvée" });
    }

    // Vérifier si l'utilisateur a le droit de fermer cette session
    if (!session.user.equals(req.user._id)) {
      logger.warn(
        `Utilisateur ${req.user._id} - Tentative de fermeture de session non autorisée.`
      );
      return res.status(403).json({ message: "Action non autorisée" });
    }

    // Fermeture de la session en mettant isActive à false
    session.isActive = false;
    await session.save();
    logger.info(`Session fermée avec succès pour l'ID : ${sessionId}`);

    res.status(200).json({ message: "Session fermée avec succès" });
  } catch (error) {
    logger.error("Erreur serveur lors de la fermeture d’une session.", {
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la fermeture de la session." });
  }
};
