//src/repositories/post.repository.js

const { Post } = require('../models')


exports.createPost = async (data) => {
    return await Post.create(data);
}