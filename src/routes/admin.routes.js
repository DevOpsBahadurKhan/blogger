// src/routes/admin.routes.js
const express = require('express');
const router = express.Router();

const { updateUserRoleValidator } = require('../validators/validator');

const passportJWT = require('../middlewares/passportJWT')();
const verifyAccess = require('../middlewares/verifyAccess');
const controller = require('../controllers/admin.controller');


router.patch(
    '/role/:userId',
    updateUserRoleValidator,
    passportJWT.authenticate(),
    verifyAccess('update', 'user', 'any'),
    controller.updateRole
);


router.post(
    '/roles',
    passportJWT.authenticate(),
    verifyAccess('create', 'role', 'any'),
    controller.createRole
);

router.post(
    '/permissions',
    passportJWT.authenticate(),
    verifyAccess('create', 'permission', 'any'),
    controller.createPermission
);

module.exports = router;
