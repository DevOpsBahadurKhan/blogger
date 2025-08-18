import authService from '../services/auth.service.js';
import validationHandler from '../validators/validationHandler.js';

export const register = async (req, res, next) => {
    try {
        validationHandler(req);

        //Sanitize input – pick only safe fields
        const { username, email, password } = req.body;

        const { user, accessToken, refreshToken } = await authService.register({ username, email, password });


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

export const login = async (req, res, next) => {
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
    } catch (err) {
        next(err);
    }
};
