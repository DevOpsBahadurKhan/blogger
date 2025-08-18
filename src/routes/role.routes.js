import express from 'express';
const router = express.Router();

import passportJWT from '../middlewares/passportJWT.js';
import verifyAccess from '../middlewares/verifyAccess.js';
import * as controller from '../controllers/role.controller.js';


// Basic CRUD operations
router.post('/roles',
    passportJWT.authenticate(), verifyAccess('create', 'role', 'any'),
    controller.createRole
);

router.get('/roles',
    passportJWT.authenticate(),
    verifyAccess('read', 'role', 'any'),
    controller.getAllRoles
);

router.get('/roles/:id',
    passportJWT.authenticate(), verifyAccess('read', 'role', 'any'),
    controller.getRoleById
);

router.put('/roles/:id',
    passportJWT.authenticate(), verifyAccess('update', 'role', 'any'),
    controller.updateRole
);

router.delete('/roles/:id',
    passportJWT.authenticate(), verifyAccess('delete', 'role', 'any'),
    controller.deleteRole
);

// Additional role operations
router.get('/roles/:id/permissions',
    passportJWT.authenticate(), verifyAccess('read', 'role', 'any'),
    controller.getRolePermissions
);

router.get('/roles/:id/users',
    passportJWT.authenticate(), verifyAccess('read', 'role', 'any'),
    controller.getRoleUsers
);

export default router;