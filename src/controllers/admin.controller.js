// blogger\src\controllers\admin.controller.js
import adminService from '../services/admin.service.js';
import logger from '../utils/logger.js';



export const assignPermissionToRole = async (req, res, next) => {
    try {
        const { roleId, permissionId } = req.params
        const meId = req.user.id; // Logged-in user's ID

        await adminService.assignPermissionToRole({ meId, roleId, permissionId });

        logger.info('Permission assigned successfully');
        res.send({ message: 'Permission assigned successfully' });
    } catch (err) {
        next(err);
    }
};
