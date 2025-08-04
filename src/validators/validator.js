const { body, param } = require('express-validator');
const mongoose = require('mongoose');

exports.hasQuestion = body('question')
    .isLength({ min: 5 }).withMessage("Question is required. Min length 5 characters");

exports.isEmail = body('email')
    .isEmail().withMessage("Email field must contain correct email");

exports.hasPassword = body('password')
    .exists().withMessage("Password can not be empty");

exports.hasDescription = body('description').isLength({ min: 5 })
    .withMessage("Description is required. Min length 5 characters");

exports.hasName = body('name').isLength({ min: 5 })
    .withMessage("Name is required. Min length 5 characters");


exports.updateUserRoleValidator = [
    param('userId')
        .custom(value => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Invalid user ID'),

    body('newRole')
        .trim()
        .isIn(['admin', 'superAdmin'])
        .withMessage('Invalid role specified'),
];