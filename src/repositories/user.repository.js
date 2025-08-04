//src/repositories/user.repository.js

const { User, Role } = require('../models')


exports.getProfile = async () => {
    return await User.findAll({
        attributes: { exclude: ['password'] }
    });
}


exports.me = async (id) => {
    return await User.findByPk(id, {
        include: {
            model: Role,
            as: 'role',
            attributes: ['name']  // Only fetch role name
        },
        attributes: { exclude: ['password'] }
    });
};