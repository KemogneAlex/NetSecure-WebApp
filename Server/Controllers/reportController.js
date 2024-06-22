const Report = require("../Models/Report");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const logger = require("../utils/logger");
const {
  userHasPermission,
  generateReportData,
} = require("../utils/permissions");
// Récupérer tous les rapports
exports.getAllReports = async (req, res) => {
  try {
    // Vérifier si l'utilisateur a le rôle ou la permission appropriée
    if (!req.user.roles.includes("admin")) {
      logger.warn(
        `Utilisateur ${req.user.id} - Tentative d'accès sans rôle d'admin.`
      );
      return res.status(403).json({ message: "Accès refusé" });
    }

    // Recherche de tous les rapports dans la base de données
    const reports = await Report.find();

    res.status(200).json(reports);
  } catch (error) {
    logger.error("Erreur serveur lors de la récupération des rapports.", {
      error: error.message,
    });
    res.status(500).json({
      message: "Erreur serveur lors de la récupération des rapports.",
    });
  }
};
// Générer un nouveau rapport
exports.generateReport = async (req, res) => {
  try {
    // Vérifier l'authentification de l'utilisateur et décoder le token
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      logger.warn("Tentative de génération de rapport sans token.");
      return res.status(401).json({ message: "Authentification requise" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) {
      logger.warn(
        "Tentative de génération de rapport par un utilisateur non authentifié."
      );
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    // Vérifier si l'utilisateur a le droit de générer un rapport
    if (!userHasPermission(user)) {
      logger.warn(
        `Utilisateur ${user.id} - Tentative de génération de rapport sans permission.`
      );
      return res.status(403).json({ message: "Accès refusé" });
    }

    // Générer les données du rapport
    const reportData = await generateReportData(user);

    // Créer une nouvelle instance de rapport avec les données générées
    const newReport = new Report(reportData);

    // Sauvegarder le rapport dans la base de données
    await newReport.save();
    logger.info(`Rapport généré avec succès pour l'utilisateur ${user.id}`);

    res
      .status(200)
      .json({ message: "Rapport généré avec succès", report: newReport });
  } catch (error) {
    logger.error("Erreur serveur lors de la génération du rapport.", {
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la génération du rapport." });
  }
};

// Fonction pour vérifier si l'utilisateur a la permission de générer un rapport
function userHasPermission(user) {
  // Vérifiez que l'objet utilisateur est défini et contient la propriété 'roles'
  if (!user || !Array.isArray(user.roles)) {
    throw new Error(
      "L'objet utilisateur est invalide ou les rôles ne sont pas définis."
    );
  }

  // Implémentez ici la logique pour vérifier si l'utilisateur a la permission
  // Exemple simple basé sur le rôle utilisateur
  const hasAdminRole = user.roles.includes("admin");

  // Vous pouvez ajouter d'autres vérifications de rôle ou de permission ici si nécessaire
  // ...

  return hasAdminRole;
}

// Fonction pour générer les données du rapport
async function generateReportData(user) {
  if (!user || !user.username) {
    throw new Error(
      "Les informations de l'utilisateur sont incomplètes ou manquantes."
    );
  }

  // Implémentez ici la logique pour récupérer et traiter les données nécessaires au rapport
  const stats = await fetchSecurityStats(); // Supposons que cette fonction récupère les statistiques de sécurité
  if (!stats) {
    throw new Error("Impossible de récupérer les statistiques de sécurité.");
  }

  // Générer un objet de données de rapport
  const reportData = {
    title: "Rapport de Sécurité Réseau",
    date: new Date().toLocaleDateString("fr-FR"), // Format de date en français
    content: `Rapport généré pour l'utilisateur ${user.username}`,
    securityStats: stats, // Utiliser les statistiques récupérées
    recommendations: generateRecommendations(stats), // Générer des recommandations basées sur les stats
  };

  // Assurez-vous que les recommandations sont générées correctement
  if (!reportData.recommendations || reportData.recommendations.length === 0) {
    throw new Error("Les recommandations n'ont pas pu être générées.");
  }

  return reportData;
}

// Fonction pour récupérer les statistiques de sécurité
async function fetchSecurityStats() {
  // Interroger la base de données ou un service externe pour obtenir les statistiques
  // Retourner un objet contenant les statistiques
  return {
    incidentsDetected: 10,
    incidentsResolved: 8,
    unresolvedIncidents: 2,
  };
}

// Fonction pour générer des recommandations basées sur les statistiques de sécurité
function generateRecommendations(stats) {
  let recommendations = [];

  // Ajouter des recommandations basées sur les incidents non résolus
  if (stats.unresolvedIncidents > 0) {
    recommendations.push("Analyser et résoudre les incidents non résolus.");
  }

  // Si le nombre d'incidents a augmenté par rapport au mois précédent
  if (stats.currentMonthIncidents > stats.previousMonthIncidents) {
    recommendations.push(
      "Examiner les causes de l'augmentation des incidents et prendre des mesures correctives."
    );
  }

  // Si le pourcentage de faux positifs est élevé
  if (stats.falsePositivesRate > 0.1) {
    // Supposons que 10% est le seuil élevé
    recommendations.push(
      "Ajuster les paramètres de détection pour réduire les faux positifs."
    );
  }

  // Autres recommandations basées sur les besoins spécifiques
  recommendations.push("Mettre à jour régulièrement tous les systèmes.");
  recommendations.push(
    "Former les utilisateurs aux meilleures pratiques de sécurité."
  );

  // Si le temps de réponse aux incidents est lent
  if (stats.averageResponseTime > stats.targetResponseTime) {
    recommendations.push(
      "Améliorer les procédures de réponse aux incidents pour réduire le temps de réponse."
    );
  }

  return recommendations;
}

// Récupérer un rapport par ID
exports.getReportById = async (req, res) => {
  try {
    const reportId = req.params.reportId;

    // Valider l'ID du rapport
    if (!reportId.match(/^[0-9a-fA-F]{24}$/)) {
      logger.warn(
        `Tentative de récupération avec un ID de rapport invalide : ${reportId}`
      );
      return res.status(400).json({ message: "ID de rapport invalide" });
    }

    // Vérifier si l'utilisateur a le rôle ou la permission appropriée
    if (!req.user.roles.includes("admin")) {
      logger.warn(
        `Utilisateur ${req.user.id} - Tentative de récupération sans rôle d'admin.`
      );
      return res.status(403).json({ message: "Accès refusé" });
    }

    // Rechercher le rapport dans la base de données en utilisant son identifiant
    const report = await Report.findById(reportId);

    // Vérifier si le rapport existe
    if (!report) {
      logger.info(`Rapport non trouvé pour l'ID : ${reportId}`);
      return res.status(404).json({ message: "Rapport non trouvé" });
    }

    res.status(200).json(report);
  } catch (error) {
    logger.error("Erreur serveur lors de la récupération d’un rapport.", {
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération du rapport." });
  }
};
// Mettre à jour un rapport
exports.updateReport = async (req, res) => {
  try {
    const reportId = req.params.reportId;

    // Valider l'ID du rapport
    if (!reportId.match(/^[0-9a-fA-F]{24}$/)) {
      logger.warn(
        `Tentative de mise à jour avec un ID de rapport invalide : ${reportId}`
      );
      return res.status(400).json({ message: "ID de rapport invalide" });
    }

    // Vérifier si l'utilisateur a le rôle ou la permission appropriée
    if (!req.user.roles.includes("admin")) {
      logger.warn(
        `Utilisateur ${req.user.id} - Tentative de mise à jour sans rôle d'admin.`
      );
      return res.status(403).json({ message: "Accès refusé" });
    }

    // Vérifier si le rapport existe dans la base de données
    const existingReport = await Report.findById(reportId);
    if (!existingReport) {
      logger.info(`Rapport non trouvé pour l'ID : ${reportId}`);
      return res.status(404).json({ message: "Rapport non trouvé" });
    }

    // Extraire les données de mise à jour à partir du corps de la requête
    const updates = req.body;

    // Mettre à jour les champs du rapport avec les nouvelles données
    Object.assign(existingReport, updates);

    await existingReport.save();
    logger.info(`Rapport mis à jour avec succès pour l'ID : ${reportId}`);

    res.status(200).json({
      message: "Rapport mis à jour avec succès",
      report: existingReport,
    });
  } catch (error) {
    logger.error(
      "Erreur serveur lors de la tentative de mise à jour d’un rapport.",
      { error: error.message }
    );
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la mise à jour du rapport." });
  }
};

// Supprimer un rapport
exports.deleteReport = async (req, res) => {
  try {
    const reportId = req.params.reportId;

    // Valider l'ID du rapport
    if (!reportId.match(/^[0-9a-fA-F]{24}$/)) {
      logger.warn(
        `Tentative de suppression avec un ID de rapport invalide : ${reportId}`
      );
      return res.status(400).json({ message: "ID de rapport invalide" });
    }

    // Vérifier si l'utilisateur a le rôle ou la permission appropriée
    if (!req.user.roles.includes("admin")) {
      logger.warn(
        `Utilisateur ${req.user.id} - Tentative de suppression sans rôle d'admin.`
      );
      return res.status(403).json({ message: "Accès refusé" });
    }

    // Vérifier si le rapport existe dans la base de données
    const existingReport = await Report.findById(reportId);
    if (!existingReport) {
      logger.info(`Rapport non trouvé pour l'ID : ${reportId}`);
      return res.status(404).json({ message: "Rapport non trouvé" });
    }

    // Supprimer le rapport de la base de données
    await existingReport.remove();
    logger.info(`Rapport supprimé avec succès pour l'ID : ${reportId}`);

    res.status(200).json({ message: "Rapport supprimé avec succès" });
  } catch (error) {
    logger.error(
      "Erreur serveur lors de la tentative de suppression d’un rapport.",
      { error: error.message }
    );
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la suppression du rapport." });
  }
};
// Logique pour récupérer les rapports existants
exports.getReports = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      logger.warn("Tentative d’accès aux rapports sans token fourni.");
      return res.status(401).json({ message: "Accès non autorisé." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      logger.warn("Tentative d’accès aux rapports avec un token non reconnu.");
      return res.status(401).json({ message: "Accès non autorisé." });
    }

    // Contrôle d'accès pour vérifier que l'utilisateur est autorisé à voir ces rapports
    if (!user.role || user.role !== "admin") {
      logger.warn(
        `Utilisateur ${user._id} - Tentative d’accès sans privilèges administratifs.`
      );
      return res.status(403).json({ message: "Accès refusé." });
    }

    // Récupération et tri des rapports par date de création décroissante
    const reports = await Report.find().sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      logger.error(
        "Erreur de token JWT lors de la récupération des rapports.",
        { error: error.message }
      );
      return res.status(401).json({ message: "Token invalide." });
    }

    logger.error("Erreur serveur lors de la récupération des rapports.", {
      error: error.message,
    });
    res.status(500).json({ message: "Erreur serveur." });
  }
};
// Exporter un rapport
exports.exportReport = async (req, res) => {
  try {
    // Assurez-vous que l'utilisateur est authentifié et que l'ID du rapport est fourni
    if (!req.user || !req.params.reportId) {
      logger.warn(
        "Tentative d’exportation de rapport sans authentification ou ID de rapport."
      );
      return res
        .status(401)
        .json({ message: "Authentification et ID de rapport requis." });
    }

    // Exportez le rapport à l'aide du service dédié
    const exportResult = await ReportService.export(
      req.user.id,
      req.params.reportId
    );

    // Renvoyez une confirmation d'exportation au client
    res.status(200).json({ message: "Rapport exporté", exportResult });
  } catch (error) {
    // Enregistrez l'erreur et renvoyez un message d'erreur non spécifique
    logger.error("Erreur lors de l’exportation du rapport", {
      error: error.message,
    });
    res.status(500).json({
      message: "Un problème est survenu lors de l’exportation du rapport.",
    });
  }
};
