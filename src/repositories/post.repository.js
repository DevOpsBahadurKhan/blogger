import db from '../models/index.js';
const { Post } = db;

class PostRepository {

    async createPost(data) {
        return await Post.create(data);
    };

    async getPosts() {
        return await Post.findAll();
    };

}

export default new PostRepository();