import express from 'express';
const router = express.Router();

import { updateUserRoleValidator } from '../validators/validator.js';

import passportJWT from '../middlewares/passportJWT.js';
const jwtMiddleware = passportJWT(); // ✅ renamed instance

import verifyAccess from '../middlewares/verifyAccess.js';
import * as controller from '../controllers/admin.controller.js';

router.patch(
    '/role/:userId',
    updateUserRoleValidator,
    jwtMiddleware.authenticate(),
    verifyAccess('update', 'user', 'any'),
    controller.updateRole
);

router.post(
    '/roles',
    jwtMiddleware.authenticate(),
    verifyAccess('create', 'role', 'any'),
    controller.createRole
);

router.post(
    '/permissions',
    jwtMiddleware.authenticate(),
    verifyAccess('create', 'permission', 'any'),
    controller.createPermission
);

export default router;
