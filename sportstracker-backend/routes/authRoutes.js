// routes/authRoutes.js

import express from 'express';
import {
  register,
  login,
  updateProfile,
  getUser
} from '../controllers/authController.js';

import {
  registerValidator,
  loginValidator,
  updateProfileValidator
} from '../middleware/auth/authValidator.js';

import { checkUniqueProfileFields } from "../middleware/auth/checkUniqueProfileFields.js";

import { validate } from '../middleware/validator/validate.js';
import authenticate from '../middleware/auth/authMiddleware.js';

const router = express.Router();

// 🔐 Login mit Feldvalidierung
router.post("/login", loginValidator, validate, login);

// 📝 Registrierung mit Validator & Fehlerbehandlung
router.post("/register", registerValidator, validate, register);

// 🛡️ Profil-Update (nur mit gültigem Token)
router.put("/user/update", updateProfileValidator, validate, authenticate, checkUniqueProfileFields, updateProfile);

// 👤 Benutzerinformationen abrufen (geschützt)
router.get("/user", authenticate, getUser);

export default router;