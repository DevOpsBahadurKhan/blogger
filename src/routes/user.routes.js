import express from 'express';
const router = express.Router();

import * as userController from '../controllers/user.controller.js';

import passportJWT from '../middlewares/passportJWT.js';

router.post('/profile', passportJWT().authenticate(), userController.me);

export default router;


