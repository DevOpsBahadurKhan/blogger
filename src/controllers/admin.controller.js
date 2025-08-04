// src/controllers/auth.controller.js
const adminService = require('../services/admin.service');


/**
 * Admin user can updateRole.
 */
exports.updateRole = async (req, res, next) => {

}

exports.createRole = async (req, res, next) => {
    try {
        const { name } = req.body;
        const role = await adminService.createRole(name);
        res.status(201).json({ message: 'Role created', role });
    } catch (err) {
        next(err);
    }
};

exports.createPermission = async (req, res, next) => {
    try {
        const permission = await adminService.createPermission(req.body);
        res.status(201).json({ message: 'Permission created', permission });
    } catch (err) {
        next(err);
    }
};