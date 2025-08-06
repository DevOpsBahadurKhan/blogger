import postService from '../services/post.service.js';


export const createPost = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const user_id = req.user.id; // ✅ get authenticated user's ID

        const post = await postService.createPost({ title, content, user_id });

        res.status(201).json({ message: 'Post created successfully', post });
    } catch (err) {
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
