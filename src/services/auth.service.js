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
        logger.info(`New user registered: ${user.email}`, { userId: user.id });

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
            logger.warn(`Login failed: No user found with email: ${userData.email}`);
            const error = new Error('Wrong Credentials');
            error.statusCode = 401;
            throw error;
        }

        const validPassword = await user.validPassword(userData.password);
        if (!validPassword) {
            logger.warn(`Login failed: Invalid password for email: ${userData.email}`);
            const error = new Error('Wrong Credentials');
            error.statusCode = 401;
            throw error;
        }

        const accessToken = jwtUtil.generateAccessToken(user);
        let refreshToken = jwtUtil.generateRefreshToken(user);

        refreshToken = await authRepo.updateRefreshToken(user.id, refreshToken);

        logger.info(`User logged in: ${user.email}`, { userId: user.id });

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
