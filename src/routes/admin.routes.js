import express from 'express';
const router = express.Router();

import { updateUserRoleValidator } from '../validators/validator.js';

import passportJWT from '../middlewares/passportJWT.js';

import verifyAccess from '../middlewares/verifyAccess.js';
import * as controller from '../controllers/admin.controller.js';


router.patch(
    '/roles/:id',
    passportJWT().authenticate(),
    updateUserRoleValidator,
    verifyAccess('update', 'role', 'any'),
    controller.updateRole
);



router.post(
    '/roles',
    passportJWT().authenticate(),
    verifyAccess('create', 'role', 'any'),
    controller.createRole
);


router.post(
    '/permissions',
    passportJWT().authenticate(),
    verifyAccess('create', 'permission', 'any'),
    controller.createPermission
);

export default router;
