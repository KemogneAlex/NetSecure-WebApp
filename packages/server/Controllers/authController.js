/**
 * @description      :
 * @author           : kemogne
 * @group            :
 * @created          : 31/05/2024 - 23:02:23
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 31/05/2024
 * - Author          : kemogne
 * - Modification    :
 **/
const User = require("../models/user");
const NodeCache = require("node-cache");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passwordValidator = require("password-validator");
const emailValidator = require("email-validator");
const NodeCache = require("node-cache");
const crypto = require("crypto");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const { sendEmail } = require("./mailjet");
const logger = require("../utils/logger");
const {
  blacklistToken,
  isTokenBlacklisted,
} = require("../middleware/tokenBlacklist");

const rateLimit = require("express-rate-limit");

// Création d'un schéma de mot de passe
const passwordSchema = new passwordValidator();
passwordSchema
  .is()
  .min(8)
  .is()
  .max(100)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .symbols()
  .has()
  .not()
  .spaces();
// Création d'une nouvelle Map pour suivre les tentatives de connexion
const loginAttempts = new Map();

// Cache pour stocker les utilisateurs fréquemment connectés
const userCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

// Fonction de validation de mot de passe
function validatePassword(password) {
  return passwordSchema.validate(password);
}

// Fonction de validation d'email
function validateEmail(email) {
  return emailValidator.validate(email) && !isDisposableEmail(email);
}

// Fonction pour vérifier si l'email est jetable
function isDisposableEmail(email) {
  const disposableDomains = ["yopmail.com", "mailinator.com"];
  const domain = email.split("@")[1];
  return disposableDomains.includes(domain);
}

// Fonction pour générer un token de réinitialisation aléatoire et sécurisé
function generateResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

// Fonction pour envoyer un email de réinitialisation du mot de passe
async function sendResetPasswordEmail(user, token) {
  const resetLink = `${process.env.RESET_PASSWORD_URL}/${user._id}/${token}`;
  const textContent = `Bonjour ${user.name},\n\nVous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien suivant pour définir un nouveau mot de passe:\n\n${resetLink}\n\nCe lien expirera dans une heure. Si vous n'avez pas demandé la réinitialisation de votre mot de passe, veuillez ignorer cet email.\n\nCordialement,\nL'équipe de votre application`;

  await sendEmail(
    user.email,
    "Réinitialisation du mot de passe",
    textContent,
    user.name,
    "PasswordReset"
  );
}

// Fonction pour réinitialiser le mot de passe
async function resetPassword(userId, token, newPassword) {
  const user = await User.findById(userId);
  if (
    !user ||
    user.resetPasswordToken !== token ||
    user.resetPasswordTokenExpires < Date.now()
  ) {
    throw new Error("Token de réinitialisation invalide ou expiré");
  }

  if (!validatePassword(newPassword)) {
    throw new Error("Mot de passe trop faible");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordTokenExpires = null;
  await user.save();
}

// Fonction pour activer la 2FA
exports.enable2FA = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Impossible de traiter la demande" });
    }

    const secret = speakeasy.generateSecret({ length: 20 });
    user.twoFactorSecret = secret.base32;
    await user.save();

    const otpauthUrl = speakeasy.otpauthURL({
      secret: secret.ascii,
      label: `MyApp (${email})`,
      issuer: "MyApp",
    });

    qrcode.toDataURL(otpauthUrl, (err, dataUrl) => {
      if (err) {
        logger.error("Erreur lors de la génération du QR code", err);
        return res
          .status(500)
          .json({ message: "Erreur lors du traitement de la demande" });
      }

      res.status(200).json({ message: "2FA enabled", qrCodeUrl: dataUrl });
    });
  } catch (err) {
    logger.error("Erreur lors de l'activation de la 2FA", err);
    res
      .status(500)
      .json({ message: "Erreur lors du traitement de la demande" });
  }
};

// Fonction pour vérifier le code 2FA
exports.verify2FA = async (req, res) => {
  try {
    const { email, token } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.twoFactorSecret) {
      logger.warn(`Utilisateur non trouvé ou 2FA non activé pour: ${email}`);
      return res
        .status(404)
        .json({ message: "Impossible de traiter la demande" });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
    });

    if (!verified) {
      logger.warn(`Échec de vérification du 2FA pour l'email: ${email}`);
      s;
      return res.status(401).json({ message: "Échec de la vérification" });
    }
    logger.info(`Vérification du 2FA réussie pour l'email: ${email}`);
    res.status(200).json({ message: "Vérification réussie" });
  } catch (err) {
    logger.error("Erreur lors de la vérification du 2FA", err);
    res
      .status(500)
      .json({ message: "Erreur lors du traitement de la demande" });
  }
};

// Fonction pour enregistrer un nouvel utilisateur
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    // Validation des champs nom et prénom
    if (!firstName || !lastName) {
      logger.warn("Le nom ou le prénom n'est pas fourni");
      return res
        .status(400)
        .json({ message: "Le nom et le prénom sont requis" });
    }
    // Vérification de la longueur du nom et du prénom
    if (firstName.length < 2 || lastName.length < 2) {
      logger.warn("Nom ou prénom trop court");
      return res.status(400).json({
        message: "Le nom et le prénom doivent contenir au moins 2 caractères",
      });
    }
    // Utilisation de regex pour valider le format du nom et du prénom
    const nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      logger.warn("Format du nom ou du prénom invalide");
      return res
        .status(400)
        .json({ message: "Le format du nom et du prénom est invalide" });
    }

    if (!validateEmail(email) || !validatePassword(password)) {
      logger.warn("Tentative d'inscription avec des données invalides");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    logger.info(`Utilisateur enregistré avec succès: ${email}`);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    logger.error("Erreur lors de l'enregistrement de l'utilisateur", err);
    res.status(500).json({ message: "Error registering user" });
  }
};

// Fonction pour connecter un utilisateur
exports.login = async (req, res) => {
  const { email, password, token } = req.body;

  // Obtenir les données de tentative de connexion
  const attemptData = loginAttempts.get(email) || {
    count: 0,
    time: Date.now(),
  };

  // Vérifier si l'utilisateur est dans la période d'attente
  if (attemptData.count >= 3) {
    const waitTime = 24 * 60 * 60 * 1000; // 24 heures en millisecondes
    if (Date.now() - attemptData.time < waitTime) {
      return res.status(429).json({
        message: "Trop de tentatives, veuillez réessayer après 24 heures",
      });
    }
  }
  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      logger.warn(`Échec de connexion pour l'email: ${email}`);
      // Incrémenter le nombre de tentatives échouées
      const newCount = attemptData.count + 1;
      loginAttempts.set(email, { count: newCount, time: attemptData.time });
      const remainingAttempts = 3 - newCount;
      // Envoyer un message d'erreur avec le nombre de tentatives restantes
      return res.status(401).json({
        message: `Identifiants invalides. Il vous reste ${remainingAttempts} tentative(s).`,
      });
    }

    if (user.twoFactorSecret) {
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token,
      });

      if (!verified) {
        logger.warn(`Échec de 2FA pour l'email: ${email}`);
        return res.status(401).json({ message: "Erreur lors de la connexion" });
      }
    }

    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    logger.info(`Connexion réussie pour l'email: ${email}`);
    res.status(200).json({ token: jwtToken });
  } catch (err) {
    logger.error(`Erreur de connexion pour l'email: ${email}`, err);
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
};
// Ajouter des logs similaires pour les autres fonctions
// Demande de réinitialisation du mot de passe
exports.resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Email invalide" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Aucun compte associé à cet email" });
    }

    const token = generateResetToken();
    user.resetPasswordToken = token;
    user.resetPasswordTokenExpires = Date.now() + 3600000; // 1 heure
    await user.save();

    await sendResetPasswordEmail(user, token);

    res.status(200).json({ message: "Email de réinitialisation envoyé" });
  } catch (err) {
    logger.error(
      "Erreur lors de la demande de réinitialisation du mot de passe",
      err
    );
    res.status(500).json({
      message: "Erreur lors de la demande de réinitialisation du mot de passe",
    });
  }
};

// Réinitialisation du mot de passe
exports.resetPassword = async (req, res) => {
  try {
    const { userId, token, newPassword } = req.body;

    await resetPassword(userId, token, newPassword);

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (err) {
    logger.error("Erreur lors de la réinitialisation du mot de passe", err);
    res
      .status(500)
      .json({ message: "Erreur lors de la réinitialisation du mot de passe" });
  }
};
// Fonction pour vérifier l'authentification de l'utilisateur
exports.authenticateUser = async (req, res) => {
  const { userId } = req.body;

  // Vérifier d'abord dans le cache
  let isAuthenticated = userCache.get(userId);

  if (!isAuthenticated) {
    // Si l'utilisateur n'est pas en cache, vérifier dans la base de données
    const user = await User.findById(userId);
    if (user) {
      // Mettre en cache l'authentification pour un temps défini
      userCache.set(userId, true, 60); // Cache pendant 60 secondes par exemple
      isAuthenticated = true;
    } else {
      isAuthenticated = false;
    }
  }

  res.status(200).json({ isAuthenticated });
};
exports.logout = (req, res) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  // Vérifier d'abord si le token a été fourni
  if (!token) {
    logger.warn("Aucun token fourni lors de la tentative de déconnexion");
    return res.status(400).json({ message: "Échec de la déconnexion" });
  }
  // Ensuite, vérifier si le token est dans la liste noire
  if (isTokenBlacklisted(token)) {
    logger.warn("Aucun token fourni lors de la tentative de déconnexion");
    return res.status(400).json({ message: "Échec de la déconnexion" });
  }

  try {
    // Ajouter le token à la liste noire
    blacklistToken(token);

    logger.info("Déconnexion réussie");
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (err) {
    logger.error("Erreur lors de la déconnexion", err);
    res.status(500).json({ message: "Erreur lors de la déconnexion" });
  }
};
