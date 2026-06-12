/**
    * @description      : 
    * @author           : kemogne
    * @group            : 
    * @created          : 29/05/2024 - 01:01:55
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 29/05/2024
    * - Author          : kemogne
    * - Modification    : 
**/
// authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    // Logique de vérification du token JWT
    next();
  } catch (error) {
    res.status(401).json({ message: 'Non autorisé' });
  }
};

module.exports = { protect };
