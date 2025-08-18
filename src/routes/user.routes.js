import express from 'express';
const router = express.Router();

import * as controller from '../controllers/user.controller.js';
import passportJWT from '../middlewares/passportJWT.js';
import verifyAccess from '../middlewares/verifyAccess.js';


// User profile routes
router.get('/profile',
    passportJWT.authenticate(), controller.me);

// User management routes
router.get('/users', passportJWT.authenticate(),
    verifyAccess('read', 'user', 'any'),
    controller.getAllUsers
);

router.get('/users/:id', passportJWT.authenticate(),
    verifyAccess('read', 'user', 'any'),
    controller.getUserById
);

router.put('/users/:id', passportJWT.authenticate(),
    verifyAccess('update', 'user', 'any'),
    controller.updateUser
);

router.delete('/users/:id', passportJWT.authenticate(),
    verifyAccess('delete', 'user', 'any'),
    controller.deleteUser
);

// User role management
router.patch('/users/:id/role', passportJWT.authenticate(),
    verifyAccess('update', 'user', 'any'),
    controller.assignRole
);

router.get('/users/:id/role', passportJWT.authenticate(),
    verifyAccess('read', 'user', 'any'),
    controller.getUserRole
);

router.get('/users/:id/permissions', passportJWT.authenticate(),
    verifyAccess('read', 'user', 'any'),
    controller.getUserPermissions
);

export default router;


