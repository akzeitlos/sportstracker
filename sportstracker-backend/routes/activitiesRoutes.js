import express from 'express';
import { 
  createActivity, 
  getUserStats, 
  getLeaderboardStats
} from '../controllers/activityController.js';

import authenticate from '../middleware/auth/authMiddleware.js';
// Optionally: import adminOnly from '../middleware/auth/adminMiddleware.js';

const router = express.Router();

// Aktivität speichern
router.post('/activity', authenticate, createActivity);

// Benutzerstatistiken (nur für eingeloggte Nutzer)
router.get('/user/stats', authenticate, getUserStats);

// Alle Benutzerstatistiken (Admin-Funktion)
router.get('/leaderboard', authenticate, getLeaderboardStats);

export default router;
