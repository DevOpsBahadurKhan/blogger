import commentRepo from '../repositories/comment.repository.js';
import logger from '../utils/logger.js';

class CommentService {

    async createComment(commentData, userId) {
        const comment = await commentRepo.create({
            ...commentData,
            user_id: userId
        });
        
        logger.info(`[Comment] New comment created`, {
            commentId: comment.id,
            userId: userId,
            postId: commentData.postId,
            context: 'createComment'
        });

        return await commentRepo.findById(comment.id);
    }

    async getCommentById(id) {
        const comment = await commentRepo.findById(id);
        if (!comment) {
            const error = new Error('Comment not found');
            error.statusCode = 404;
            throw error;
        }
        return comment;
    }

    async getCommentsByPost(postId) {
        return await commentRepo.findByPostId(postId);
    }

    async getCommentsByUser(userId) {
        return await commentRepo.findByUserId(userId);
    }

    async getAllComments() {
        return await commentRepo.findAll();
    }

    async updateComment(id, updateData, userId) {
        const comment = await commentRepo.findById(id);
        if (!comment) {
            const error = new Error('Comment not found');
            error.statusCode = 404;
            throw error;
        }

        // Check if user owns the comment
        if (comment.user_id !== userId) {
            const error = new Error('Not authorized to update this comment');
            error.statusCode = 403;
            throw error;
        }

        const updatedComment = await commentRepo.update(id, updateData);
        
        logger.info(`[Comment] Comment updated`, {
            commentId: id,
            userId: userId,
            context: 'updateComment'
        });

        return updatedComment;
    }

    async deleteComment(id, userId) {
        const comment = await commentRepo.findById(id);
        if (!comment) {
            const error = new Error('Comment not found');
            error.statusCode = 404;
            throw error;
        }

        // Check if user owns the comment
        if (comment.user_id !== userId) {
            const error = new Error('Not authorized to delete this comment');
            error.statusCode = 403;
            throw error;
        }

        const deleted = await commentRepo.delete(id);
        
        logger.info(`[Comment] Comment deleted`, {
            commentId: id,
            userId: userId,
            context: 'deleteComment'
        });

        return deleted;
    }
}

export default new CommentService();
