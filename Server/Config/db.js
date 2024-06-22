/**
    * @description      : 
    * @author           : kemogne
    * @group            : 
    * @created          : 14/06/2024 - 18:49:44
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 14/06/2024
    * - Author          : kemogne
    * - Modification    : 
**/
const mongoose = require('mongoose');

// Variable d'environnement pour une sécurité accrue
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  let numRetries = 0;
  const maxRetries = 5; // Nombre maximum de tentatives de reconnexion
  const retryDelayMs = 1000; // Délai initial entre les tentatives (en millisecondes)

  while (numRetries < maxRetries) {
    try {
      // Tentative de connexion à la base de données
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // Options de pool de connexions si nécessaire
      });
      console.log('Connexion MongoDB réussie.');
      return; // Connexion réussie, sortir de la boucle
    } catch (err) {
      // Capture et enregistrement des informations détaillées sur l'erreur
      console.error(`Échec de la connexion MongoDB (tentative ${numRetries + 1}) :`, err.message);
      console.error('Pile d\'appels:', err.stack);
      console.error('Heure de l\'erreur:', new Date().toISOString());

      // Notification ou système d'alerte à implémenter ici

      numRetries++;
      // Attente avec un délai exponentiel avant la prochaine tentative
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs * Math.pow(2, numRetries - 1)));
    }
  }

  // Toutes les tentatives de reconnexion ont échoué
  console.error(`Échec de la connexion MongoDB après ${maxRetries} tentatives.`);
  // Notification ou système d'alerte à implémenter ici
  process.exit(1);
};

module.exports = connectDB;

