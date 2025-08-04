//src/repositories/user.repository.js

const { Role, Permission } = require('../models')


exports.updateRole = async (req, res, next) => {

}



exports.createRole = async (name) => {
    return await Role.create({ name });
};

exports.createPermission = async ({ role_id, resource, action, possession }) => {
    return await Permission.create({ role_id, resource, action, possession });
};