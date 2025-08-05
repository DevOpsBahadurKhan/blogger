import { body, param } from 'express-validator';
import mongoose from 'mongoose';

export const hasQuestion = body('question')
    .isLength({ min: 5 }).withMessage("Question is required. Min length 5 characters");

export const isEmail = body('email')
    .isEmail().withMessage("Email field must contain correct email");

export const hasPassword = body('password')
    .exists().withMessage("Password can not be empty");

export const hasDescription = body('description')
    .isLength({ min: 5 }).withMessage("Description is required. Min length 5 characters");

export const hasName = body('name')
    .isLength({ min: 5 }).withMessage("Name is required. Min length 5 characters");

export const updateUserRoleValidator = [
    param('userId')
        .custom(value => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Invalid user ID'),

    body('newRole')
        .trim()
        .isIn(['admin', 'superAdmin'])
        .withMessage('Invalid role specified'),
];
