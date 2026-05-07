import { body } from 'express-validator';

export const registerValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const loginValidator = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const productValidator = [
  body('name').notEmpty(),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').isIn(['Furniture', 'Lighting', 'Decor', 'Lifestyle']),
  body('description').notEmpty(),
];