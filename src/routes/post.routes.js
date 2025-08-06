import express from 'express';
const router = express.Router();

import * as postController from '../controllers/post.controller.js';
import passportJWT from '../middlewares/passportJWT.js';

router.post('/posts', passportJWT().authenticate(), postController.createPost);
router.get('/posts', passportJWT().authenticate(), postController.getPosts);

export default router;
