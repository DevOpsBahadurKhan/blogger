import userService from '../services/user.service.js';
// import validationHandler from '../validators/validationHandler.js'; // Uncomment when needed
import logger from '../utils/logger.js';

export const getProfile = async (req, res, next) => {
    try {
        const users = await userService.getProfile();
        res.send(users);
    } catch (err) {
        next(err);
    }
};

/**
 * Get the authenticated user's profile.
 */
export const me = async (req, res, next) => {
    try {
        const id = req.user.id;
        const user = await userService.me(id);
        res.send(user);
    } catch (err) {
        next(err);
    }
};
