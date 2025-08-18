import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '5h' }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.jwtRefreshSecret,
        { expiresIn: '7d' }
    );
};
