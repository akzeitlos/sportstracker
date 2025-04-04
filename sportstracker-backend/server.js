// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './routes/authRoutes.js';
import activitiesRoutes from './routes/activitiesRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // JSON-Daten verarbeiten

// API-Routen einbinden
app.use("/api", authRoutes);
app.use("/api", activitiesRoutes);

// Server starten
app.listen(5000, () => {
  console.log("🚀 Backend läuft auf http://localhost:5000");
});
