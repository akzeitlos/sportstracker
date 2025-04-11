import validator from 'express-validator';
const { body } = validator;

export const registerValidator = [
  body('firstname').trim().notEmpty().withMessage('First name is required.'),
  body('lastname').trim().notEmpty().withMessage('Last name is required.'),
  body('username').trim().notEmpty().withMessage('Username is required.'),
  body('email').trim().isEmail().withMessage('Valid email is required.'),
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must include a special character.')
];

export const loginValidator = [
  body('emailOrUsername').trim().notEmpty().withMessage('Email or username is required.'),
  body('password').notEmpty().withMessage('Password is required.')
];

export const updateProfileValidator = [
  body('firstname')
    .trim()
    .notEmpty()
    .withMessage('First name is required.'),
  
  body('lastname')
    .trim()
    .notEmpty()
    .withMessage('Last name is required.'),
  
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required.'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please enter a valid email.'),

  body('password')
    .optional({ checkFalsy: true }) // only validate if not empty
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must include a special character.')
];
