const userRepo = require('../repositories/auth.repository');
const jwtUtil = require('../utils/jwt.util');

class AuthService {

    async register(userData) {
        const existingUser = await userRepo.findByEmail(userData.email);
        if (existingUser) {
            const error = new Error('Email already used');
            error.statusCode = 403;
            throw error;
        }

        let user = await userRepo.register(userData);

        const accessToken = jwtUtil.generateAccessToken(user);
        const refreshToken = jwtUtil.generateRefreshToken(user);

        user = await userRepo.updateRefreshToken(user.id, refreshToken);


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
        const user = await userRepo.findByEmail(userData.email);
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

        refreshToken = await userRepo.updateRefreshToken(user.id, refreshToken);

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

module.exports = new AuthService(); // export as singleton instance
