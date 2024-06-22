/**
 * @description      :
 * @author           : kemogne
 * @group            :
 * @created          : 14/06/2024 - 21:47:05
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 14/06/2024
 * - Author          : kemogne
 * - Modification    :
 **/
const cron = require("node-cron");
const { generateSecurityReport } = require("./reportGenerator"); // Assurez-vous que ce module existe et exporte la fonction correspondante

const cronConfig = () => {
  // Tâche cron qui s'exécute tous les jours à minuit
  cron.schedule("0 0 * * *", async () => {
    console.log("Génération du rapport de sécurité quotidien...");
    try {
      const report = await generateSecurityReport(); // Génère le rapport de sécurité
      // Logique pour stocker le rapport dans la base de données
      console.log("Rapport de sécurité généré et stocké avec succès.");
    } catch (error) {
      console.error(
        "Erreur lors de la génération du rapport de sécurité :",
        error.message
      );
      // Implémenter la gestion des erreurs supplémentaire ici
    }
  });

  // Ajoutez d'autres tâches cron si nécessaire
};

module.exports = cronConfig;
