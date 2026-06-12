/**
    * @description      : 
    * @author           : kemogne
    * @group            : 
    * @created          : 31/05/2024 - 03:19:19
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 31/05/2024
    * - Author          : kemogne
    * - Modification    : 
**/
const express = require('express');
const router = express.Router();
const alertController = require('../Controllers/alertController');

// Routes pour la gestion des alertes de sécurité
console.log('Fonction getAllAlerts:', alertController.getAllAlerts);
router.get('/', alertController.getAllAlerts);

console.log('Fonction addAlert:', alertController.addAlert);
router.post('/', alertController.addAlert);

console.log('Fonction getAlertById:', alertController.getAlertById);
router.get('/:alertId', alertController.getAlertById);

console.log('Fonction updateAlert:', alertController.updateAlert);
router.put('/:alertId', alertController.updateAlert);

console.log('Fonction deleteAlert:', alertController.deleteAlert);
router.delete('/:alertId', alertController.deleteAlert);

module.exports = router;
