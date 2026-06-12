/**
    * @description      : 
    * @author           : kemogne
    * @group            : 
    * @created          : 01/06/2024 - 03:52:03
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 01/06/2024
    * - Author          : kemogne
    * - Modification    : 
**/
const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    // Ajout d'un index pour optimiser les requêtes impliquant le champ userId
    index: true
  },
  message: {
    type: String,
    required: true,
    trim: true // Supprime les espaces blancs au début et à la fin
  },
  level: {
    type: String,
    enum: ['info', 'warning', 'critical'],
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // Ajout d'un index pour optimiser le tri par date de création
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    // Assurez-vous que le champ updatedAt est mis à jour à chaque modification de l'alerte
    set: () => Date.now()
  }
});

module.exports = mongoose.model('Alert', alertSchema);
