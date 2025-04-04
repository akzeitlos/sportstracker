// routes/activitiesRoutes.js
import express from 'express';
import { createActivity, getUserStats } from '../controllers/activityController.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

// Aktivität speichern
router.post('/activity', authenticate, createActivity);

// Alle Aktivitäten des Benutzers abrufen
router.get('/user/stats', authenticate, getUserStats); // API-Route für Benutzerstatistiken

export default router;
