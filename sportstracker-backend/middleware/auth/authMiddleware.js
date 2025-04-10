// middleware/auth/authMiddleware.js
import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, "geheimes_token");
    req.user = decoded; // Füge die Benutzerinformationen an `req.user` an
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token." });
  }
};

export default authenticate;
