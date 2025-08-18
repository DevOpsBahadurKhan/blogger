import db from '../models/index.js';

const { Comment, User, Post } = db;

class CommentRepository {
    
    async create(commentData) {
        return await Comment.create(commentData);
    }

    async findById(id) {
        return await Comment.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'User',
                    attributes: ['id', 'username', 'email']
                },
                {
                    model: Post,
                    as: 'Post',
                    attributes: ['id', 'title']
                }
            ]
        });
    }

    async findByPostId(postId) {
        return await Comment.findAll({
            where: { post_id: postId },
            include: [
                {
                    model: User,
                    as: 'User',
                    attributes: ['id', 'username', 'email']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
    }

    async findByUserId(userId) {
        return await Comment.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Post,
                    as: 'Post',
                    attributes: ['id', 'title']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
    }

    async update(id, updateData) {
        await Comment.update(updateData, { where: { id } });
        return await this.findById(id);
    }

    async delete(id) {
        return await Comment.destroy({ where: { id } });
    }

    async findAll() {
        return await Comment.findAll({
            include: [
                {
                    model: User,
                    as: 'User',
                    attributes: ['id', 'username', 'email']
                },
                {
                    model: Post,
                    as: 'Post',
                    attributes: ['id', 'title']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
    }
}

export default new CommentRepository();
