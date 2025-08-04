const postService = require('../services/post.service');

exports.createPost = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        await postService.createPost({ title, content });

    } catch (err) {
        next(err)
    }
}