// blogger\src\controllers\admin.controller.js
import adminService from '../services/admin.service.js';
import logger from '../utils/logger.js';



export const assignPermissionToRole = async (req, res, next) => {
    try {
        await adminService.assignPermissionToRole(req.params);
        logger.info('Permission assigned successfully');
        res.send({ message: 'Permission assigned successfully' });
    } catch (err) {
        next(err);
    }
};
