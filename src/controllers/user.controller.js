// src/controllers/auth.controller.js
const userService = require('../services/user.service');
// const validationHandler = require('../validators/validationHandler');


exports.getProfile = async (req, res, next) => {
    try {

        let user = await userService.getProfile();
        res.send(user);

    } catch (err) {
        next(err)
    }
};


/**
 * Get the authenticated user's profile.
 */
exports.me = async (req, res, next) => {
    try {
        const id = req.user.id;
        let user = await userService.me(id);
        res.send(user);

    } catch (err) {
        next(err)
    }
};

