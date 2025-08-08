// blogger\src\controllers\role.controller.js

import roleService from '../services/role.service.js';
import logger from '../utils/logger.js';


export const createRole = async (req, res, next) => {
    try {
        const role = await roleService.createRole(req.body.name);
        logger.info('role created',
            { ip: req.ip });

        res.status(201).json({ message: 'role created', role });
    } catch (err) {
        next(err);
        logger.error(err);
    }
};
