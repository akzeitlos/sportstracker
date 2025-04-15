import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js'; // ← Pool mit .promise()

// ===============================
// Registrierung
// ===============================
export const register = async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;
  const errors = {};

  try {
    // Prüfen ob Benutzername oder E-Mail existieren
    const [results] = await db.query(
      "SELECT username, email FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    results.forEach(user => {
      if (user.username === username) errors.username = "Username already exists.";
      if (user.email === email) errors.email = "Email already exists.";
    });

    if (Object.keys(errors).length > 0) {
      return res.status(409).json({ errors });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    // Benutzer speichern
    await db.query(
      "INSERT INTO users (firstname, lastname, username, email, password) VALUES (?, ?, ?, ?, ?)",
      [firstname, lastname, username, email, hashedPassword]
    );

    res.status(200).json({ message: "Registration successful!" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ errors: { general: "Database error. Please try again later." } });
  }
};

// ===============================
// Login
// ===============================
export const login = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const [results] = await db.query(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [emailOrUsername, emailOrUsername]
    );

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
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ errors: { general: "Server error. Please try again later." } });
  }
};

// ===============================
// Profil aktualisieren
// ===============================
export const updateProfile = async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;
  const userId = req.user.userId;

  try {
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

    const [result] = await db.query(query, values);

    res.json({ message: "Profile updated successfully!" });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ errors: { general: "Error updating profile." } });
  }
};

// ===============================
// Benutzer abrufen
// ===============================
export const getUser = async (req, res) => {
  const userId = req.user.userId;

  try {
    const [results] = await db.query(
      "SELECT id, firstname, lastname, username, email FROM users WHERE id = ?",
      [userId]
    );

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
  } catch (err) {
    console.error("User fetch error:", err);
    res.status(500).json({ errors: { general: "Error fetching user data." } });
  }
};
