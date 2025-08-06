import postService from '../services/post.service.js';
import logger from '../utils/logger.js';

export const createPost = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const user_id = req.user.id; 

        const post = await postService.createPost({ title, content, user_id });

        logger.info('Post created successfully', {
            userId: user_id
        });

        res.status(201).json({ message: 'Post created successfully', post });
    } catch (err) {
        logger.error(err)
        next(err);
    }
};

export const getPosts = async (req, res, next) => {
    try {

        const posts = await postService.getPosts();
        res.status(201).json({ message: 'Post created successfully', posts });

    } catch (err) {
        next(err);
    }
};
