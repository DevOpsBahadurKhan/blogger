import postRepo from '../repositories/post.repository.js';
import logger from '../utils/logger.js'


class PostService {

    async createPost(data) {

        return await postRepo.createPost(data);
    };

    async getPosts() {
        return await postRepo.getPosts();
    };

}

export default new PostService();