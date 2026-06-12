/**
    * @description      : 
    * @author           : kemogne
    * @group            : 
    * @created          : 01/06/2024 - 02:44:26
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 01/06/2024
    * - Author          : kemogne
    * - Modification    : 
**/
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 55
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 55
  },

email: {
  type: String,
  required: true,
  unique: true,
  trim: true,
  lowercase: true,
  validate:[isEmail] 

},
password: {
  type: String,
  required: true,
  max: 1024,
  minlength: 6
},
isEmailVerified: {
  type: Boolean,
  default: false,
},
role: {
  type: String,
  enum: ['user', 'admin'],
  default: 'user'
},

  profilePicture: {
    type: String
  },
  status: {
    type: String
},
activities: [{
  action: String,
  timestamps: {
    type: Date,
    default: Date.now,
  },
}],
sessions: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Session'
}],

createdAt: {
  type: Date,
  default: Date.now,
},
updatedAt: {
  type: Date,
  default: Date.now,
},
lastLogin: {
  type: Date,
},
devices: {
  type: [String]
},
picture:{
  type : String,
  default: "./uploads/profil/random-user.png"
}

});
// Méthode pour hasher le mot de passe avant de sauvegarder l'utilisateur
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});
// Méthode pour vérifier le mot de passe lors de la connexion
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);

};

// Méthode pour générer un jeton de vérification d'e-mail
userSchema.methods.generateEmailVerificationToken = function () {
  const token = jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};
// Méthode pour générer un jeton de réinitialisation de mot de passe
userSchema.methods.generatePasswordResetToken = function () {
  const token = jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};
// Méthode pour mettre à jour la dernière connexion
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = Date.now();
  try {
    await this.save();
  } catch (error) {
    // Gérer l'erreur
    console.error('Erreur lors de la mise à jour de la dernière connexion :', error);
  }
};

module.exports = mongoose.model('User', userSchema);