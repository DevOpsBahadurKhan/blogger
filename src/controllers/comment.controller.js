import commentService from '../services/comment.service.js';
import validationHandler from '../validators/validationHandler.js';

export const createComment = async (req, res, next) => {
    try {
        validationHandler(req);
        
        const userId = req.user.id;
        const comment = await commentService.createComment(req.body, userId);
        
        res.status(201).json({
            message: 'Comment created successfully',
            comment
        });
    } catch (error) {
        next(error);
    }
};

export const getComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const comment = await commentService.getCommentById(id);
        
        res.json(comment);
    } catch (error) {
        next(error);
    }
};

export const getCommentsByPost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const comments = await commentService.getCommentsByPost(postId);
        
        res.json(comments);
    } catch (error) {
        next(error);
    }
};

export const getMyComments = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const comments = await commentService.getCommentsByUser(userId);
        
        res.json(comments);
    } catch (error) {
        next(error);
    }
};

export const getAllComments = async (req, res, next) => {
    try {
        const comments = await commentService.getAllComments();
        
        res.json(comments);
    } catch (error) {
        next(error);
    }
};

export const updateComment = async (req, res, next) => {
    try {
        validationHandler(req);
        
        const { id } = req.params;
        const userId = req.user.id;
        const comment = await commentService.updateComment(id, req.body, userId);
        
        res.json({
            message: 'Comment updated successfully',
            comment
        });
    } catch (error) {
        next(error);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        await commentService.deleteComment(id, userId);
        
        res.json({
            message: 'Comment deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
