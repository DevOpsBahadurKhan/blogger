import express from 'express';
const router = express.Router();

import passportJWT from '../middlewares/passportJWT.js';
import verifyAccess from '../middlewares/verifyAccess.js';
import * as controller from '../controllers/userRole.controller.js';


// User-Role Management Routes
router.post('/users/:userId/roles/:roleId',
    verifyAccess('update', 'user', 'any'),
    controller.assignRoleToUser, passportJWT.authenticate()
);

router.delete('/users/:userId/roles/:roleId', passportJWT.authenticate(),
    verifyAccess('update', 'user', 'any'),
    controller.removeRoleFromUser
);

router.get('/users/:userId/roles', passportJWT.authenticate(),
    verifyAccess('read', 'user', 'any'),
    controller.getUserRoles
);

router.get('/users/:userId/roles/permissions', passportJWT.authenticate(),
    verifyAccess('read', 'user', 'any'),
    controller.getUserRolesWithPermissions
);

router.get('/roles/:roleId/users', passportJWT.authenticate(),
    verifyAccess('read', 'role', 'any'),
    controller.getRoleUsers
);

// User-Role Update Routes
router.put('/users/:userId/roles/:roleId',
    verifyAccess('update', 'user', 'any'),
    controller.updateUserRole, passportJWT.authenticate()
);

router.patch('/users/:userId/roles/:roleId/deactivate',
    verifyAccess('update', 'user', 'any'),
    controller.deactivateUserRole, passportJWT.authenticate()
);

router.patch('/users/:userId/roles/:roleId/activate',
    verifyAccess('update', 'user', 'any'),
    controller.activateUserRole, passportJWT.authenticate()
);

// Bulk Operations
router.post('/users/:userId/roles/bulk-assign',
    verifyAccess('update', 'user', 'any'),
    controller.bulkAssignRoles, passportJWT.authenticate()
);

router.post('/users/:userId/roles/bulk-remove',
    verifyAccess('update', 'user', 'any'),
    controller.bulkRemoveRoles, passportJWT.authenticate()
);

// Utility Routes
router.get('/users/:userId/roles/:roleId/check',
    verifyAccess('read', 'user', 'any'),
    controller.checkUserHasRole, passportJWT.authenticate()
);

export default router;
