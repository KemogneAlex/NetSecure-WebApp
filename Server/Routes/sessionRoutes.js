/**
    * @description      : 
    * @author           : kemogne
    * @group            : 
    * @created          : 31/05/2024 - 03:11:05
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 31/05/2024
    * - Author          : kemogne
    * - Modification    : 
**/
const express = require('express');
const router = express.Router();
const sessionController = require('../Controllers/sessionController');

console.log('Fonction getActiveSessions:', sessionController.getActiveSessions);
// Route pour récupérer les sessions actives de l'utilisateur
router.get('/sessions', sessionController.getActiveSessions);

console.log('Fonction closeSession:', sessionController.closeSession);
// Route pour fermer une session spécifique
router.delete('/sessions/:sessionId', sessionController.closeSession);

module.exports = router;
