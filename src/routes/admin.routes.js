import express from 'express';
const router = express.Router();

import { assignPermissionValidator } from '../validators/validator.js';

import passportJWT from '../middlewares/passportJWT.js';
import verifyAccess from '../middlewares/verifyAccess.js';
import * as controller from '../controllers/admin.controller.js';


// Assign Role to User
router.patch(
  '/users/:userId/role',
  passportJWT.authenticate(),
  verifyAccess('update', 'role', 'any'),
  controller.assignRoleToUser
);

// Assign permission to Role
router.post(
  "/roles/:roleId/permissions/:permissionId",
  assignPermissionValidator,
  passportJWT.authenticate(), 
  verifyAccess('assign', 'role_permissions', 'any'),
  controller.assignPermissionToRole
);

export default router;
