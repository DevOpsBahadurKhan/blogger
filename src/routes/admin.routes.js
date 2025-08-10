import express from 'express';
const router = express.Router();

import { updateUserRoleValidator } from '../validators/validator.js';

import passportJWT from '../middlewares/passportJWT.js';
import verifyAccess from '../middlewares/verifyAccess.js';
import * as controller from '../controllers/admin.controller.js';



// Only admin (or equivalent) can assign permissions
router.post(
  "/roles/:roleId/permissions/:permissionId",
  passportJWT().authenticate(), 
  verifyAccess('assign', 'role_permissions', 'any'),
  controller.assignPermissionToRole
);

export default router;
