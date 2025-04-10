import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {

  const errors = validationResult(req);

  errors.array().forEach(err => {
    console.log("PARAM:", err.path, "→", err.msg);
  });

  if (!errors.isEmpty()) {
    const formatted = {};
    errors.array().forEach(err => {
      formatted[err.path] = err.msg;
    });
    return res.status(400).json({ errors: formatted });
  }
  next();
};