const postRepo = require('../repositories/post.repository');

exports.createPost = async (data) => {
    return await postRepo.createPost(data);
};
