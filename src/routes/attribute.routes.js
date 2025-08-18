import express from 'express';
import passportJWT from '../middlewares/passportJWT.js';
import verifyAccess from '../middlewares/verifyAccess.js';
import * as controller from '../controllers/attribute.controller.js';

const router = express.Router();

// Attribute management (admin only)
router.post('/attributes',
  passportJWT.authenticate(), verifyAccess('create', 'permission', 'any'),
  controller.createAttribute
);

router.get('/attributes',
  passportJWT.authenticate(), verifyAccess('read', 'permission', 'any'),
  controller.getAllAttributes
);

router.get('/attributes/:id',
  passportJWT.authenticate(), verifyAccess('read', 'permission', 'any'),
  controller.getAttributeById
);

router.put('/attributes/:id',
  passportJWT.authenticate(), verifyAccess('update', 'permission', 'any'),
  controller.updateAttribute
);

router.delete('/attributes/:id',
  passportJWT.authenticate(), verifyAccess('delete', 'permission', 'any'),
  controller.deleteAttribute
);

// User attribute management
router.get('/users/:userId/attributes',
  passportJWT.authenticate(), verifyAccess('read', 'user', 'any'),
  controller.getUserAttributes
);

router.post('/users/:userId/attributes',
  passportJWT.authenticate(), verifyAccess('update', 'user', 'any'),
  controller.setUserAttribute
);

// Resource attribute management
router.get('/resources/:resourceName/:resourceId/attributes',
  passportJWT.authenticate(), verifyAccess('read', 'permission', 'any'),
  controller.getResourceAttributes
);

router.post('/resources/:resourceName/:resourceId/attributes',
  passportJWT.authenticate(), verifyAccess('update', 'permission', 'any'),
  controller.setResourceAttribute
);



export default router;
