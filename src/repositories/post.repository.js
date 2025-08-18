import db from '../models/index.js';
import logger from '../utils/logger.js';

const { Post, User } = db;

class PostRepository {

    async createPost(data) {
        try {
            const post = await Post.create(data);
            
            logger.info(`[PostRepo] Post created`, {
                postId: post.id,
                title: post.title,
                userId: data.user_id,
                context: 'createPost'
            });
            
            return post;
        } catch (error) {
            logger.error(`[PostRepo] Error creating post: ${error.message}`, {
                data,
                error: error.stack,
                context: 'createPost'
            });
            throw error;
        }
    }

    async getPosts() {
        try {
            const posts = await Post.findAll({
                include: {
                    model: User,
                    attributes: ['id', 'username', 'email']
                },
                order: [['createdAt', 'DESC']]
            });
            
            logger.info(`[PostRepo] Retrieved ${posts.length} posts`, {
                count: posts.length,
                context: 'getPosts'
            });
            
            return posts;
        } catch (error) {
            logger.error(`[PostRepo] Error retrieving posts: ${error.message}`, {
                error: error.stack,
                context: 'getPosts'
            });
            throw error;
        }
    }

    async getPostById(id) {
        try {
            const post = await Post.findByPk(id, {
                include: {
                    model: User,
                    attributes: ['id', 'username', 'email']
                }
            });
            
            if (post) {
                logger.info(`[PostRepo] Retrieved post by ID`, {
                    postId: id,
                    title: post.title,
                    context: 'getPostById'
                });
            } else {
                logger.warn(`[PostRepo] Post not found`, { postId: id, context: 'getPostById' });
            }
            
            return post;
        } catch (error) {
            logger.error(`[PostRepo] Error retrieving post by ID: ${error.message}`, {
                postId: id,
                error: error.stack,
                context: 'getPostById'
            });
            throw error;
        }
    }

    async updatePost(id, data) {
        try {
            await Post.update(data, { where: { id } });
            const updatedPost = await this.getPostById(id);
            
            logger.info(`[PostRepo] Post updated`, {
                postId: id,
                context: 'updatePost'
            });
            
            return updatedPost;
        } catch (error) {
            logger.error(`[PostRepo] Error updating post: ${error.message}`, {
                postId: id,
                data,
                error: error.stack,
                context: 'updatePost'
            });
            throw error;
        }
    }

    async deletePost(id) {
        try {
            const deleted = await Post.destroy({ where: { id } });
            
            logger.info(`[PostRepo] Post deleted`, {
                postId: id,
                deleted: deleted > 0,
                context: 'deletePost'
            });
            
            return deleted;
        } catch (error) {
            logger.error(`[PostRepo] Error deleting post: ${error.message}`, {
                postId: id,
                error: error.stack,
                context: 'deletePost'
            });
            throw error;
        }
    }

}

export default new PostRepository();