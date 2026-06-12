/**
    * @description      : 
    * @author           : kemogne
    * @group            : 
    * @created          : 01/06/2024 - 03:50:01
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 01/06/2024
    * - Author          : kemogne
    * - Modification    : 
**/
const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    // Ajout d'un index pour optimiser les requêtes impliquant le champ userId
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true // Supprime les espaces blancs au début et à la fin
  },
  type: {
    type: String,
    required: true,
    trim: true // Supprime les espaces blancs au début et à la fin
  },
  identifier: {
    type: String,
    required: true,
    unique: true, // Assurez-vous que l'identifiant est unique dans la base de données
    trim: true // Supprime les espaces blancs au début et à la fin
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
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  }
});

module.exports = mongoose.model('Device', deviceSchema);
