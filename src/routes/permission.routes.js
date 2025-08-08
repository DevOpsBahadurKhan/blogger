import express from 'express'
const router = express.Router();

import passportJWT from '../middlewares/passportJWT.js';

import * as controller from '../controllers/permission.controller.js';


router.post('/permission', controller.createPermission);


export default router;