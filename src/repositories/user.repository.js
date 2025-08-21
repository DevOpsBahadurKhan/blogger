import db from '../models/index.js';
import logger from '../utils/logger.js';
import { Op } from 'sequelize';

const { User, Role, Permission, Profile } = db;


class UserRepository {
    async getProfile(userId) {
        try {
            const user = await User.findByPk(userId, {
                attributes: { exclude: ['password', 'refreshToken'] },
                include: [
                    {
                        model: Role,
                        as: 'roles',
                        attributes: ['id', 'name', 'description'],
                        through: { attributes: [] }
                    },
                    {
                        model: Profile,
                        as: 'profile',
                    }
                ]
            });

            logger.info('[UserRepository] User profile fetched', { userId, hasProfile: !!user?.profile });
            return user;
        } catch (error) {
            logger.error('[UserRepository] Error getting user profile', { error: error.message, stack: error.stack, userId });
            throw error;
        }
    }

    

    async getAllUsers({ page = 1, limit = 10, search }) {
        try {
            const offset = (page - 1) * limit;
            const whereClause = search ? {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } }
                ]
            } : {};
            
            const users = await User.findAll({
                where: whereClause,
                attributes: { exclude: ['password', 'refreshToken'] },
                include: [
                    {
                        model: Role,
                        as: 'roles',
                        attributes: ['id', 'name', 'description'],
                        through: { attributes: [] }
                    },
                    {
                        model: Profile,
                        as: 'profile'
                    }
                ],
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['createdAt', 'DESC']]
            });
            
            logger.info('[UserRepository] All users retrieved', {
                count: users.length,
                page,
                limit
            });
            
            return users;
        } catch (error) {
            logger.error('[UserRepository] Error getting all users', {
                error: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    async updateUser(id, updateData) {
        try {
            const [updatedRowsCount] = await User.update(updateData, {
                where: { id },
                returning: true
            });
            
            if (updatedRowsCount === 0) {
                return null;
            }
            
            const user = await User.findByPk(id, {
                attributes: { exclude: ['password', 'refreshToken'] },
                include: [
                    {
                        model: Role,
                        as: 'roles',
                        attributes: ['id', 'name', 'description'],
                        through: { attributes: [] }
                    },
                    {
                        model: Profile,
                        as: 'profile'
                    }
                ]
            });
            
            logger.info('[UserRepository] User updated', {
                userId: id
            });
            
            return user;
        } catch (error) {
            logger.error('[UserRepository] Error updating user', {
                error: error.message,
                stack: error.stack,
                userId: id
            });
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            const deletedRowsCount = await User.destroy({
                where: { id }
            });
            
            logger.info('[UserRepository] User deletion attempted', {
                userId: id,
                deleted: deletedRowsCount > 0
            });
            
            return deletedRowsCount > 0;
        } catch (error) {
            logger.error('[UserRepository] Error deleting user', {
                error: error.message,
                stack: error.stack,
                userId: id
            });
            throw error;
        }
    }

    async assignRole(userId, roleId) {
        try {
            const user = await User.findByPk(userId);
            const role = await Role.findByPk(roleId);
            
            if (!user || !role) {
                throw new Error('User or role not found');
            }
            
            await user.addRole(role);
            
            logger.info('[UserRepository] Role assigned to user', {
                userId,
                roleId
            });
            
            return { userId, roleId, assigned: true };
        } catch (error) {
            logger.error('[UserRepository] Error assigning role', {
                error: error.message,
                stack: error.stack,
                userId,
                roleId
            });
            throw error;
        }
    }

    async getUserRoles(userId) {
        try {
            const user = await User.findByPk(userId, {
                include: [
                    {
                        model: Role,
                        as: 'roles',
                        attributes: ['id', 'name', 'description'],
                        through: { attributes: [] }
                    },
                    {
                        model: Profile,
                        as: 'profile'
                    }
                ]
            });
            
            if (!user) {
                return [];
            }
            
            logger.info('[UserRepository] User roles retrieved', {
                userId,
                roleCount: user.roles.length
            });
            
            return user.roles;
        } catch (error) {
            logger.error('[UserRepository] Error getting user roles', {
                error: error.message,
                stack: error.stack,
                userId
            });
            throw error;
        }
    }

    async getUserPermissions(userId) {
        try {
            const user = await User.findByPk(userId, {
                include: [{
                    model: Role,
                    as: 'roles',
                    include: [{
                        model: Permission,
                        as: 'permissions',
                        attributes: ['id', 'name', 'description'],
                        through: { attributes: [] }
                    }],
                    through: { attributes: [] }
                }]
            });
            
            if (!user) {
                return [];
            }
            
            // Flatten permissions from all roles
            const permissions = user.roles.reduce((acc, role) => {
                return acc.concat(role.permissions || []);
            }, []);
            
            // Remove duplicates
            const uniquePermissions = permissions.filter((permission, index, self) => 
                index === self.findIndex(p => p.id === permission.id)
            );
            
            logger.info('[UserRepository] User permissions retrieved', {
                userId,
                permissionCount: uniquePermissions.length
            });
            
            return uniquePermissions;
        } catch (error) {
            logger.error('[UserRepository] Error getting user permissions', {
                error: error.message,
                stack: error.stack,
                userId
            });
            throw error;
        }
    }

    async getUserById(id) {
        try {
            const user = await User.findByPk(id, {
                attributes: { exclude: ['password', 'refreshToken'] },
                include: [
                    {
                        model: Role,
                        as: 'roles',
                        attributes: ['id', 'name', 'description'],
                        through: { attributes: [] }
                    },
                    {
                        model: Profile,
                        as: 'profile'
                    }
                ]
            });
            
            logger.info('[UserRepository] User retrieved by ID', {
                userId: id,
                found: !!user
            });
            
            return user;
        } catch (error) {
            logger.error('[UserRepository] Error getting user by ID', {
                error: error.message,
                stack: error.stack,
                userId: id
            });
            throw error;
        }
    }

    async me(userId) {
        try {
            const user = await User.findByPk(userId, {
                attributes: { exclude: ['password', 'refreshToken'] },
                include: [
                    {
                        model: Role,
                        as: 'roles',
                        attributes: ['id', 'name', 'description'],
                        through: { attributes: [] }
                    },
                    {
                        model: Profile,
                        as: 'profile'
                    }
                ]
            });
            
            logger.info('[UserRepository] Current user profile retrieved', {
                userId
            });
            
            return user;
        } catch (error) {
            logger.error('[UserRepository] Error getting current user profile', {
                error: error.message,
                stack: error.stack,
                userId
            });
            throw error;
        }
    }
}

export default new UserRepository();