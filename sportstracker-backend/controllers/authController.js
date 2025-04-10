import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

// ===============================
// Registrierung
// ===============================
export const register = async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;
  const errors = {};

  // Checke auf vorhandene Benutzer (Username oder E-Mail)
  db.query(
    "SELECT username, email FROM users WHERE username = ? OR email = ?",
    [username, email],
    async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ errors: { general: "Database error. Please try again later." } });
      }

      // Doppelung prüfen
      results.forEach(user => {
        if (user.username === username) errors.username = "Username already exists.";
        if (user.email === email) errors.email = "Email already exists.";
      });

      if (Object.keys(errors).length > 0) {
        return res.status(409).json({ errors });
      }

      // Passwort hashen und Benutzer speichern
      const hashedPassword = await bcrypt.hash(password, 10);
      db.query(
        "INSERT INTO users (firstname, lastname, username, email, password) VALUES (?, ?, ?, ?, ?)",
        [firstname, lastname, username, email, hashedPassword],
        (err) => {
          if (err) {
            console.error("Insert error:", err);
            return res.status(500).json({ errors: { general: "Error saving user. Please try again later." } });
          }

          res.status(200).json({ message: "Registration successful!" });
        }
      );
    }
  );
};

// ===============================
// Login
// ===============================
export const login = (req, res) => {
  const { emailOrUsername, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ? OR username = ?";
  db.query(query, [emailOrUsername, emailOrUsername], async (err, results) => {
    if (err) {
      console.error("Login DB error:", err);
      return res.status(500).json({ errors: { general: "Server error. Please try again later." } });
    }

    if (results.length === 0) {
      return res.status(401).json({ errors: { emailOrUsername: "E-Mail or username not found." } });
    }

    const user = results[0];

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ errors: { password: "Incorrect password." } });
    }

    const token = jwt.sign({ userId: user.id }, "geheimes_token", { expiresIn: "1h" });

    res.status(200).json({ message: "Login erfolgreich!", token });
  });
};

// ===============================
// Profil aktualisieren
// ===============================
export const updateProfile = async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;
  const userId = req.user.userId;

  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const query = `
    UPDATE users 
    SET firstname = ?, lastname = ?, username = ?, email = ? 
    ${password ? ', password = ?' : ''}
    WHERE id = ?
  `;

  const values = [firstname, lastname, username, email];
  if (password) values.push(hashedPassword);
  values.push(userId);

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating user profile:", err);
      return res.status(500).json({ errors: { general: "Error updating profile." } });
    }

    res.json({ message: "Profile updated successfully!" });
  });
};

// ===============================
// Benutzer abrufen
// ===============================
export const getUser = (req, res) => {
  const userId = req.user.userId;

  db.query("SELECT id, firstname, lastname, username, email FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user data:", err);
      return res.status(500).json({ errors: { general: "Error fetching user data." } });
    }

    if (results.length === 0) {
      return res.status(404).json({ errors: { general: "User not found." } });
    }

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
