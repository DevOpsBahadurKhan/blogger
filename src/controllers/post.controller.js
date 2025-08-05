import * as postService from '../services/post.service.js';

export const createPost = async (req, res, next) => {
    try {
        const { title, content } = req.body;

        const post = await postService.createPost({ title, content });

        res.status(201).json({ message: 'Post created successfully', post });
    } catch (err) {
        next(err);
    }
};
