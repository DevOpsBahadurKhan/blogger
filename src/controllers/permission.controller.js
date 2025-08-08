// blogger\src\controllers\permission.controller.js

import permissionService from '../services/permission.service.js';
import logger from '../utils/logger.js';


export const createPermission = async (req, res, next) => {
    try {

        const permission = await permissionService.createPermission(req.body);
        logger.info('Permission created',
            { ip: req.ip });

        res.status(201).json({ message: 'Permission created', permission });
    } catch (err) {
        next(err);
        logger.error(err);
    }
};



