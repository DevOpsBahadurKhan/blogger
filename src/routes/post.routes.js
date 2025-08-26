import express from 'express';
const router = express.Router();

import * as postController from '../controllers/post.controller.js';
import passportJWT from '../middlewares/passportJWT.js';

router.post('/posts', passportJWT.authenticate("jwt", { session: false }), postController.createPost);
// router.get('/posts', passportJWT.authenticate("jwt", { session: false }), postController.getPosts);
router.get('/posts', postController.getPosts);

export default router;
