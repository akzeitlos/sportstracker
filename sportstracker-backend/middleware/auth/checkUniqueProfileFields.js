import db from '../../config/db.js';

export const checkUniqueProfileFields = (req, res, next) => {
  const { username, email } = req.body;
  const userId = req.user.userId; // comes from token middleware

  const query = `
    SELECT id, username, email 
    FROM users 
    WHERE (username = ? OR email = ?) AND id != ?
  `;

  db.query(query, [username, email, userId], (err, results) => {
    if (err) {
      console.error("Uniqueness check DB error:", err);
      return res.status(500).json({ errors: { general: "Database error. Please try again later." } });
    }

    const errors = {};
    results.forEach(user => {
      if (user.username === username) errors.username = "Username already exists.";
      if (user.email === email) errors.email = "Email already exists.";
    });

    if (Object.keys(errors).length > 0) {
      return res.status(409).json({ errors });
    }

    next(); // All good, continue to controller
  });
};