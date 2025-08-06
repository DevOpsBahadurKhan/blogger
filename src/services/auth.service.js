import authRepo from '../repositories/auth.repository.js';
import * as jwtUtil from '../utils/jwt.util.js';

class AuthService {
    async register(userData) {
        const existingUser = await authRepo.findByEmail(userData.email);
        if (existingUser) {
            const error = new Error('Email already used');
            error.statusCode = 403;
            throw error;
        }

        let user = await authRepo.register(userData);

        const accessToken = jwtUtil.generateAccessToken(user);
        const refreshToken = jwtUtil.generateRefreshToken(user);

        user = await authRepo.updateRefreshToken(user.id, refreshToken);

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            accessToken,
            refreshToken
        };
    }

    async login(userData) {
        const user = await authRepo.findByEmail(userData.email);
        if (!user) {
            const error = new Error('Wrong Credentials');
            error.statusCode = 401;
            throw error;
        }

        const validPassword = await user.validPassword(userData.password);
        if (!validPassword) {
            const error = new Error('Wrong Credentials');
            error.statusCode = 401;
            throw error;
        }

        const accessToken = jwtUtil.generateAccessToken(user);
        let refreshToken = jwtUtil.generateRefreshToken(user);

        refreshToken = await authRepo.updateRefreshToken(user.id, refreshToken);

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            accessToken,
            refreshToken
        };
    }
}

export default new AuthService();
