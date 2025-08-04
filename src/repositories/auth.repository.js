// src/repositories/user.repository.js
const { User } = require('../models');

class UserRepository {


    async findByEmail(email) {
        return await User.findOne({ where: { email } });
    }

    async updateRefreshToken(userId, token) {
        await User.update(
            { refreshToken: token },
            { where: { id: userId } }
        );
        return await User.findByPk(userId); // Return updated user
    }

    async register(data) {
        return await User.create(data);
    }

  
}

module.exports = new UserRepository();
