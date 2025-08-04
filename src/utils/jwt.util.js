const jwt = require('jsonwebtoken');

exports.generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.jwtSecret,
        { expiresIn: '15m' }
    );
};

exports.generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.jwtRefreshSecret,
        { expiresIn: '7d' }
    );
};
