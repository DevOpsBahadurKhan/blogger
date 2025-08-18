import express from 'express';
const router = express.Router();

import * as commentController from '../controllers/comment.controller.js';
import passportJWT from '../middlewares/passportJWT.js';
import verifyAccess from '../middlewares/verifyAccess.js';

// Create a new comment (authenticated users only)
router.post(
    '/',
    passportJWT.authenticate("jwt", { session: false }),
    verifyAccess('create', 'comment', 'own'),
    commentController.createComment
);

// Get all comments (admin only)
router.get(
    '/',
    passportJWT.authenticate("jwt", { session: false }),
    verifyAccess('read', 'comment', 'any'),
    commentController.getAllComments
);

// Get comments by post ID (public access)
router.get('/post/:postId', commentController.getCommentsByPost);

// Get current user's comments
router.get(
    '/my-comments',
    passportJWT.authenticate("jwt", { session: false }),
    commentController.getMyComments
);

// Get specific comment by ID
router.get('/:id', commentController.getComment);

// Update comment (owner only)
router.put(
    '/:id',
    passportJWT.authenticate("jwt", { session: false }),
    verifyAccess('update', 'comment', 'own'),
    commentController.updateComment
);

// Delete comment (owner only)
router.delete(
    '/:id',
    passportJWT.authenticate("jwt", { session: false }),
    verifyAccess('delete', 'comment', 'own'),
    commentController.deleteComment
);

export default router;
