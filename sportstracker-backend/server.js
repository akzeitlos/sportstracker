import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './routes/authRoutes.js';
import activitiesRoutes from './routes/activitiesRoutes.js';
import https from 'https';
import http from 'http';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // JSON-Daten verarbeiten

// Pfade zu den SSL-Zertifikaten (nur für Produktionsumgebung)
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/pushandpull.fun/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/pushandpull.fun/fullchain.pem')
};

// API-Routen einbinden
app.use("/api", authRoutes);
app.use("/api", activitiesRoutes);

// Entscheide, ob HTTPS oder HTTP verwendet werden soll
if (process.env.NODE_ENV === 'production') {
  // Produktionsumgebung: HTTPS
  https.createServer(options, app).listen(5000, () => {
    console.log('Backend läuft auf https://pushandpull.fun:5000');
  });
} else {
  // Lokale Umgebung: HTTP
  http.createServer(app).listen(5000, () => {
    console.log('Backend läuft auf http://localhost:5000');
  });
}
