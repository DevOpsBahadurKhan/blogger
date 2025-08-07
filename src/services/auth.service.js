import authRepo from '../repositories/auth.repository.js';
import * as jwtUtil from '../utils/jwt.util.js';
import logger from '../utils/logger.js';

class AuthService {

    /** @register New User */
    async register(userData) {
        const existingUser = await authRepo.findByEmail(userData.email);
        if (existingUser) {
            logger.warn(`Registration attempt with used email: ${userData.email}`);
            const error = new Error('Email already used');
            error.statusCode = 403;
            throw error;
        }

        let user = await authRepo.register(userData);
        logger.info(`[Auth] New user registered`, {
            user_id: user.id,
            email: user.email,
            role: user.role?.name || 'reader', // optional chaining
            context: 'register',
        });

        const accessToken = jwtUtil.generateAccessToken(user);
        const refreshToken = jwtUtil.generateRefreshToken(user);

        user = await authRepo.updateRefreshToken(user.id, refreshToken);

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken,
        };
    }

    /** @Login Existing User */
    async login(userData) {
        const user = await authRepo.findByEmail(userData.email);
        if (!user) {
            logger.warn(`[Auth] Login failed: Email not found`, {
                email: userData.email,
                context: 'login',
            });

            const error = new Error('Wrong Credentials');
            error.statusCode = 401;
            throw error;
        }

        const validPassword = await user.validPassword(userData.password);
        if (!validPassword) {
            logger.warn(`[Auth] Login failed: Invalid password`, {
                email: user.email,
                userId: user.id,
                context: 'login',
            });

            const error = new Error('Wrong Credentials');
            error.statusCode = 401;
            throw error;
        }

        const accessToken = jwtUtil.generateAccessToken(user);
        let refreshToken = jwtUtil.generateRefreshToken(user);

        refreshToken = await authRepo.updateRefreshToken(user.id, refreshToken);

        logger.info(`[Auth] User logged in`, {
            userId: user.id,
            email: user.email,
            role: user.role?.name || 'reader',
            context: 'login',
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken,
        };
    }
}

export default new AuthService();
