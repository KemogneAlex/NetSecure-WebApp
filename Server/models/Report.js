/**
    * @description      : 
    * @author           : kemogne
    * @group            : 
    * @created          : 01/06/2024 - 03:47:45
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 01/06/2024
    * - Author          : kemogne
    * - Modification    : 
**/
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true // Supprime les espaces blancs au début et à la fin
  },
  description: {
    type: String,
    required: true,
    trim: true // Supprime les espaces blancs au début et à la fin
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    // Ajout d'un index pour optimiser les requêtes impliquant le champ generatedBy
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // Ajout d'un index pour optimiser le tri par date de création
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true // Assurez-vous que les données du rapport sont toujours fournies
  }
});

module.exports = mongoose.model('Report', reportSchema);
