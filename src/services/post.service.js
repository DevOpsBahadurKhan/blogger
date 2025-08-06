import postRepo from '../repositories/post.repository.js';



class PostService {

    async createPost(data) {
        return await postRepo.createPost(data);
    };

    async getPosts() {
        return await postRepo.getPosts();
    };

}

export default new PostService();