import express from 'express';
const router = express.Router();

import * as userController from '../controllers/user.controller.js';

import passportJWT from '../middlewares/passportJWT.js';
const jwtMiddleware = passportJWT(); // ✅ call the function

router.post('/profile', jwtMiddleware.authenticate(), userController.me);

export default router;


