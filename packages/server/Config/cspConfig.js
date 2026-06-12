/**
 * @description      :
 * @author           : kemogne
 * @group            :
 * @created          : 14/06/2024 - 21:56:31
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 14/06/2024
 * - Author          : kemogne
 * - Modification    :
 **/
const helmet = require("helmet");

const cspConfig = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      // Spécifiez ici les domaines de confiance d'où les scripts peuvent être chargés
    ],
    styleSrc: [
      "'self'",
      // Spécifiez ici les domaines de confiance d'où les styles peuvent être chargés
    ],
    imgSrc: ["'self'", "data:"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'", "https:", "data:"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
  // Ajoutez reportUri si vous souhaitez être informé des violations de la politique CSP
});

module.exports = cspConfig;
