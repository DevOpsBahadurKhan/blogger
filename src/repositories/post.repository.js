import db from '../models/index.js';
const { Post } = db;
export const createPost = async (data) => {
    return await Post.create(data);
};
