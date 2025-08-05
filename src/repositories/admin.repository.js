import db from '../models/index.js';
const { Role, Permission } = db;

export const updateRole = async (req, res, next) => {
    // Implementation pending
};

export const createRole = async (name) => {
    return await Role.create({ name });
};

export const createPermission = async ({ role_id, resource, action, possession }) => {
    return await Permission.create({ role_id, resource, action, possession });
};
