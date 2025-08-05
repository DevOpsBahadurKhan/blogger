import db from '../models/index.js';

const { User, Role } = db;

export const getProfile = async () => {
    return await User.findAll({
        attributes: { exclude: ['password'] }
    });
};

export const me = async (id) => {
    return await User.findByPk(id, {
        include: {
            model: Role,
            as: 'role',
            attributes: ['name']  // Only fetch role name
        },
        attributes: { exclude: ['password'] }
    });
};
