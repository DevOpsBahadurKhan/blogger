import postService from '../services/post.service.js';
import validationHandler from '../validators/validationHandler.js';
import logger from '../utils/logger.js';

export const createPost = async (req, res, next) => {
    try {
        validationHandler(req);
        
        const { title, content } = req.body;
        const user_id = req.user.id; 

        const post = await postService.createPost({ title, content, user_id });

        logger.info(`[PostController] Post created successfully`, {
            postId: post.id,
            userId: user_id,
            context: 'createPost'
        });

        res.status(201).json({ message: 'Post created successfully', post });
    } catch (err) {
        logger.error(`[PostController] Error creating post: ${err.message}`, {
            userId: req.user?.id,
            body: req.body,
            error: err.stack,
            context: 'createPost'
        });
        next(err);
    }
};

export const getPosts = async (req, res, next) => {
    try {
        const posts = await postService.getPosts();
        
        logger.info(`[PostController] Posts retrieved successfully`, {
            count: posts.length,
            context: 'getPosts'
        });
        
        res.status(200).json({ message: 'Posts retrieved successfully', posts });
    } catch (err) {
        logger.error(`[PostController] Error retrieving posts: ${err.message}`, {
            error: err.stack,
            context: 'getPosts'
        });
        next(err);
    }
};

export const getPost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await postService.getPostById(id);
        
        logger.info(`[PostController] Post retrieved successfully`, {
            postId: id,
            context: 'getPost'
        });
        
        res.json(post);
    } catch (err) {
        logger.error(`[PostController] Error retrieving post: ${err.message}`, {
            postId: req.params.id,
            error: err.stack,
            context: 'getPost'
        });
        next(err);
    }
};

export const updatePost = async (req, res, next) => {
    try {
        validationHandler(req);
        
        const { id } = req.params;
        const userId = req.user.id;
        const post = await postService.updatePost(id, req.body, userId);
        
        logger.info(`[PostController] Post updated successfully`, {
            postId: id,
            userId,
            context: 'updatePost'
        });
        
        res.json({ message: 'Post updated successfully', post });
    } catch (err) {
        logger.error(`[PostController] Error updating post: ${err.message}`, {
            postId: req.params.id,
            userId: req.user?.id,
            body: req.body,
            error: err.stack,
            context: 'updatePost'
        });
        next(err);
    }
};

export const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        await postService.deletePost(id, userId);
        
        logger.info(`[PostController] Post deleted successfully`, {
            postId: id,
            userId,
            context: 'deletePost'
        });
        
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        logger.error(`[PostController] Error deleting post: ${err.message}`, {
            postId: req.params.id,
            userId: req.user?.id,
            error: err.stack,
            context: 'deletePost'
        });
        next(err);
    }
};
