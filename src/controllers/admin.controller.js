import adminService from '../services/admin.service.js';
import validateRequest from '../validators/validationHandler.js'

export const assignRoleToUser = async (req, res, next) => {
    try {
        validateRequest(req);

        // ✅ Keep camelCase in code
        const { roleId } = req.body;
        const { userId } = req.params;

        console.log({ roleId, userId });

        const user = await adminService.assignRoleToUser(userId, roleId);

        res.send({
            message: 'User role updated successfully',
            user,
        });
    } catch (error) {
        next(error);
    }
};

export const assignPermissionToRole = async (req, res, next) => {
    try {
        validateRequest(req);
        await adminService.assignPermissionToRole(req.params);
        res.send({ message: 'Permission assigned successfully' });
    } catch (err) {
        next(err);
    }
};
