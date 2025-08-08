import express from 'express'
const router = express.Router();

import passportJWT from '../middlewares/passportJWT.js';
import verifyAccess from '../middlewares/verifyAccess.js';

import * as controller from '../controllers/permission.controller.js';


router.post('/permission', passportJWT().authenticate(),
    verifyAccess('create', 'permission', 'any'), controller.createPermission);


export default router;