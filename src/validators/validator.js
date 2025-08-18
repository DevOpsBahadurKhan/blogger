// BlogBuddy/src/validators/validator.js
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



// ✅ Validate roleId and permissionId params (with empty check)
export const assignPermissionValidator = [
  param('roleId')
    .notEmpty().withMessage('Role ID is required')
    .bail() // stop running further validations if empty
    .isInt({ min: 1 }).withMessage('Role ID must be a valid positive integer'),

  param('permissionId')
    .notEmpty().withMessage('Permission ID is required')
    .bail()
    .isInt({ min: 1 }).withMessage('Permission ID must be a valid positive integer')
];