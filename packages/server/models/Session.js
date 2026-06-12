/**
    * @description      : 
    * @author           : kemogne
    * @group            : 
    * @created          : 01/06/2024 - 03:45:11
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 01/06/2024
    * - Author          : kemogne
    * - Modification    : 
**/
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    // Ajout d'un index pour optimiser les requêtes impliquant le champ userId
    index: true
  },
  ipAddress: {
    type: String,
    required: true,
    // Validation de l'adresse IP pour s'assurer qu'elle suit un format valide
    validate: {
      validator: function(v) {
        return /^([0-9]{1,3}\.){3}[0-9]{1,3}$/.test(v);
      },
      message: props => `${props.value} n'est pas une adresse IP valide!`
    }
  },
  userAgent: {
    type: String,
    required: true,
    // Validation du User Agent pour éviter les entrées malveillantes
    validate: {
      validator: function(v) {
        return /^[\w\-. ]+$/.test(v);
      },
      message: props => `User Agent non valide!`
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '1d', // La session expire après 1 jour
    // Ajout d'un index pour optimiser l'expiration des documents
    index: { expires: '1d' }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Session', sessionSchema);
