// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';  // Importiere die DB-Verbindung

// Registrierung
export const register = async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;
  
  // Passwort hashen
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (firstname, lastname, username, email, password) VALUES (?, ?, ?, ?, ?)",
    [firstname, lastname, username, email, hashedPassword],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Registrierung erfolgreich!" });
    }
  );
};

// Login
export const login = (req, res) => {
  const { emailOrUsername, password } = req.body;
  
  const query = `
    SELECT * FROM users WHERE email = ? OR username = ?
  `;
  
  db.query(query, [emailOrUsername, emailOrUsername], async (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(401).json({ message: "Ungültige Anmeldeinformationen" });

    const user = results[0];

    // Passwort überprüfen
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ message: "Ungültige Anmeldeinformationen" });

    // JWT-Token erstellen
    const token = jwt.sign({ userId: user.id }, "geheimes_token", { expiresIn: "1h" });

    res.json({ message: "Login erfolgreich!", token });
  });
};

// Update Profil
export const updateProfile = async (req, res) => {
    const { firstname, lastname, username, email, password } = req.body;
    const userId = req.user.userId;  // Benutzer ID aus dem JWT-Token
  
    // Optional: Passwort hashen, falls es geändert wird
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
  
    // SQL-Abfrage zum Aktualisieren des Profils
    let query = `
      UPDATE users 
      SET firstname = ?, lastname = ?, username = ?, email = ? 
      ${password ? ', password = ?' : ''}
      WHERE id = ?
    `;
  
    let values = [firstname, lastname, username, email];
    if (password) values.push(hashedPassword);
    values.push(userId);
  
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error updating user profile:", err);
        return res.status(500).json({ message: "Error updating profile" });
      }
  
      res.json({ message: "Profile updated successfully!" });
    });
  };

  // controllers/authController.js
export const getUser = (req, res) => {
  const userId = req.user.userId; // Hol dir die Benutzer-ID aus dem JWT-Token

  db.query("SELECT id, firstname, lastname, username, email FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user data:", err);
      return res.status(500).json({ message: "Error fetching user data" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Rückgabe der Benutzerdaten (ohne Passwort)
    const user = results[0];
    res.json({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email
    });
  });
};
