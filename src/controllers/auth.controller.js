// src/controllers/auth.controller.js
const authService = require('../services/auth.service');
const validationHandler = require('../validators/validationHandler');


exports.register = async (req, res, next) => {
    try {
        validationHandler(req);

        const { user, accessToken, refreshToken } = await authService.register(req.body);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ user, accessToken });
    } catch (err) {
        next(err);
    }
};


exports.login = async (req, res, next) => {
    try {
        validationHandler(req);

        const { user, accessToken, refreshToken } = await authService.login(req.body);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ user, accessToken });

    } catch (error) {
        next(error);
    }
}