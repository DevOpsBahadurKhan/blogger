import { body, param } from 'express-validator';

// Validate question field
export const hasQuestion = body('question')
  .isLength({ min: 5 }).withMessage("Question is required. Min length 5 characters");

// Validate email format
export const isEmail = body('email')
  .isEmail().withMessage("Email field must contain correct email");

// Validate password presence
export const hasPassword = body('password')
  .exists().withMessage("Password can not be empty");

// Validate description length
export const hasDescription = body('description')
  .isLength({ min: 5 }).withMessage("Description is required. Min length 5 characters");

// Validate name length
export const hasName = body('name')
  .isLength({ min: 5 }).withMessage("Name is required. Min length 5 characters");

// Validate user ID and role update input
export const updateUserRoleValidator = [
  param('userId')
    .isInt({ min: 1 }).withMessage('User ID must be a valid integer'),

  body('newRole')
    .trim()
    .isIn(['admin', 'superAdmin'])  // or use `role_id` if FK
    .withMessage('Invalid role specified'),

  body('role_id')
    .isInt().withMessage('Role ID must be a valid number')

];
