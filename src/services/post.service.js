import postRepo from '../repositories/post.repository.js';
import logger from '../utils/logger.js'


class PostService {

    async createPost(data) {
        try {
            const post = await postRepo.createPost(data);
            
            logger.info(`[Post] New post created`, {
                postId: post.id,
                title: post.title,
                userId: data.user_id,
                context: 'createPost'
            });
            
            return post;
        } catch (error) {
            logger.error(`[Post] Error creating post: ${error.message}`, {
                data,
                error: error.stack,
                context: 'createPost'
            });
            throw error;
        }
    }

    async getPosts() {
        try {
            const posts = await postRepo.getPosts();
            
            logger.info(`[Post] Retrieved ${posts.length} posts`, {
                count: posts.length,
                context: 'getPosts'
            });
            
            return posts;
        } catch (error) {
            logger.error(`[Post] Error retrieving posts: ${error.message}`, {
                error: error.stack,
                context: 'getPosts'
            });
            throw error;
        }
    }

    async getPostById(id) {
        try {
            const post = await postRepo.getPostById(id);
            
            if (!post) {
                logger.warn(`[Post] Post not found`, { postId: id, context: 'getPostById' });
                const error = new Error('Post not found');
                error.statusCode = 404;
                throw error;
            }
            
            logger.info(`[Post] Retrieved post`, {
                postId: id,
                title: post.title,
                context: 'getPostById'
            });
            
            return post;
        } catch (error) {
            logger.error(`[Post] Error retrieving post: ${error.message}`, {
                postId: id,
                error: error.stack,
                context: 'getPostById'
            });
            throw error;
        }
    }

    async updatePost(id, data, userId) {
        try {
            const post = await postRepo.getPostById(id);
            
            if (!post) {
                logger.warn(`[Post] Post not found for update`, { postId: id, context: 'updatePost' });
                const error = new Error('Post not found');
                error.statusCode = 404;
                throw error;
            }

            if (post.user_id !== userId) {
                logger.warn(`[Post] Unauthorized update attempt`, { 
                    postId: id, 
                    userId, 
                    postOwnerId: post.user_id,
                    context: 'updatePost' 
                });
                const error = new Error('Not authorized to update this post');
                error.statusCode = 403;
                throw error;
            }

            const updatedPost = await postRepo.updatePost(id, data);
            
            logger.info(`[Post] Post updated`, {
                postId: id,
                userId,
                context: 'updatePost'
            });
            
            return updatedPost;
        } catch (error) {
            logger.error(`[Post] Error updating post: ${error.message}`, {
                postId: id,
                userId,
                data,
                error: error.stack,
                context: 'updatePost'
            });
            throw error;
        }
    }

    async deletePost(id, userId) {
        try {
            const post = await postRepo.getPostById(id);
            
            if (!post) {
                logger.warn(`[Post] Post not found for deletion`, { postId: id, context: 'deletePost' });
                const error = new Error('Post not found');
                error.statusCode = 404;
                throw error;
            }

            if (post.user_id !== userId) {
                logger.warn(`[Post] Unauthorized delete attempt`, { 
                    postId: id, 
                    userId, 
                    postOwnerId: post.user_id,
                    context: 'deletePost' 
                });
                const error = new Error('Not authorized to delete this post');
                error.statusCode = 403;
                throw error;
            }

            const deleted = await postRepo.deletePost(id);
            
            logger.info(`[Post] Post deleted`, {
                postId: id,
                userId,
                context: 'deletePost'
            });
            
            return deleted;
        } catch (error) {
            logger.error(`[Post] Error deleting post: ${error.message}`, {
                postId: id,
                userId,
                error: error.stack,
                context: 'deletePost'
            });
            throw error;
        }
    }

}

export default new PostService();