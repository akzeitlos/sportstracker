import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './routes/authRoutes.js';
import activitiesRoutes from './routes/activitiesRoutes.js';
import http from 'http';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // JSON-Daten verarbeiten

// API-Routen einbinden
app.use("/api", authRoutes);
app.use("/api", activitiesRoutes);

// Lokale Umgebung: HTTP (Kein HTTPS in Docker benötigt)
http.createServer(app).listen(5000, '0.0.0.0', () => {
  console.log('Backend läuft auf http://0.0.0.0:5000');
});