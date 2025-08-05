import * as postRepo from '../repositories/post.repository.js';

export const createPost = async (data) => {
    return await postRepo.createPost(data);
};
