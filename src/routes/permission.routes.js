import express from 'express';
const router = express.Router();

import passportJWT from '../middlewares/passportJWT.js';
import verifyAccess from '../middlewares/verifyAccess.js';
import * as controller from '../controllers/permission.controller.js';


// Permission CRUD operations
router.post('/permissions',
    passportJWT.authenticate(), verifyAccess('create', 'permission', 'any'),
    controller.createPermission
);

router.get('/permissions',
    passportJWT.authenticate(), verifyAccess('read', 'permission', 'any'),
    controller.getAllPermissions
);

router.get('/permissions/:id',
    passportJWT.authenticate(), verifyAccess('read', 'permission', 'any'),
    controller.getPermissionById
);

router.put('/permissions/:id',
    passportJWT.authenticate(), verifyAccess('update', 'permission', 'any'),
    controller.updatePermission
);

router.delete('/permissions/:id',
    passportJWT.authenticate(), verifyAccess('delete', 'permission', 'any'),
    controller.deletePermission
);

// Permission filtering routes
router.get('/permissions/resource/:resource',
    passportJWT.authenticate(), verifyAccess('read', 'permission', 'any'),
    controller.getPermissionsByResource
);

router.get('/permissions/action/:action',
    passportJWT.authenticate(), verifyAccess('read', 'permission', 'any'),
    controller.getPermissionsByAction
);

export default router;