// routes/authRoutes.js
import express from 'express';
import { register, login, updateProfile, getUser } from '../controllers/authController.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

// Registrierung
router.post("/register", register);

// Login
router.post("/login", login);

// Profil aktualisieren (PUT-Route)
router.put("/user/update", authenticate, updateProfile);
// Benutzer abrufen (GET-Route)
router.get("/user", authenticate, getUser);


export default router;
