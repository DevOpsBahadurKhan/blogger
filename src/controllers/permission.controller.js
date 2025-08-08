// blogger\src\controllers\permission.controller.js

import permissionService from '../services/permission.service.js';
import logger from '../utils/logger.js';


export const createPermission = async (req, res, next) => {
    try {
        const data = {};
        data.possession = req.body.possession;
        data.action = req.body.action;
        data.resource = req.body.resource
        const userId = req.user.id;
        if (!userId) {
            let err = new Error('Wrong Credentials');
            logger.error(err);
            throw err;
        }
        data.role_id = +userId;

        const permission = await permissionService.createSinglePermission(data);
        logger.info('Permission created',
            { ip: req.ip });

        res.status(201).json({ message: 'Permission created', permission });
    } catch (err) {
        next(err);
        logger.error(err);
    }
};



