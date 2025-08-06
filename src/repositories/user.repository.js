import db from '../models/index.js';

const { User, Role } = db;


class UserRepository {
    async getProfile() {
        return await User.findAll({
            attributes: { exclude: ['password'] }
        });
    };

    async me(id) {
        return await User.findByPk(id, {
            include: {
                model: Role,
                as: 'role',
                attributes: ['name']  // Only fetch role name
            },
            attributes: { exclude: ['password'] }
        });
    };
}

export default new UserRepository();