import userRepository from '../repositories/user.repository.js';
import logger from '../utils/logger.js';

class UserService {

  async getAllUsers({ page = 1, limit = 10, search }) {
    try {
      const users = await userRepository.getAllUsers({ page, limit, search });

      logger.info('[UserService] All users retrieved', {
        count: users.length,
        page,
        limit
      });

      return users;
    } catch (error) {
      logger.error('[UserService] Error getting all users', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async updateUser(id, updateData) {
    try {
      const user = await userRepository.updateUser(id, updateData);

      if (user) {
        logger.info('[UserService] User updated', {
          userId: id
        });
      } else {
        logger.warn('[UserService] User not found for update', {
          userId: id
        });
      }

      return user;
    } catch (error) {
      logger.error('[UserService] Error updating user', {
        error: error.message,
        stack: error.stack,
        userId: id
      });
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const deleted = await userRepository.deleteUser(id);

      if (deleted) {
        logger.info('[UserService] User deleted', {
          userId: id
        });
      } else {
        logger.warn('[UserService] User not found for deletion', {
          userId: id
        });
      }

      return deleted;
    } catch (error) {
      logger.error('[UserService] Error deleting user', {
        error: error.message,
        stack: error.stack,
        userId: id
      });
      throw error;
    }
  }

  async assignRole(userId, roleId) {
    try {
      const result = await userRepository.assignRole(userId, roleId);

      logger.info('[UserService] Role assigned to user', {
        userId,
        roleId
      });

      return result;
    } catch (error) {
      logger.error('[UserService] Error assigning role', {
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
      const roles = await userRepository.getUserRoles(userId);

      logger.info('[UserService] User roles retrieved', {
        userId,
        roleCount: roles.length
      });

      return roles;
    } catch (error) {
      logger.error('[UserService] Error getting user roles', {
        error: error.message,
        stack: error.stack,
        userId
      });
      throw error;
    }
  }

  async getUserPermissions(userId) {
    try {
      const permissions = await userRepository.getUserPermissions(userId);

      logger.info('[UserService] User permissions retrieved', {
        userId,
        permissionCount: permissions.length
      });

      return permissions;
    } catch (error) {
      logger.error('[UserService] Error getting user permissions', {
        error: error.message,
        stack: error.stack,
        userId
      });
      throw error;
    }
  }

  async me(userId) {
    try {
      const user = await userRepository.me(userId);

      logger.info('[UserService] Current user profile retrieved', {
        userId
      });

      return user;
    } catch (error) {
      logger.error('[UserService] Error getting current user profile', {
        error: error.message,
        stack: error.stack,
        userId
      });
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const user = await userRepository.getUserById(id);

      if (!user) {
        logger.warn(`[User] User not found`, { userId: id, context: 'getUserById' });
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      logger.info(`[User] Retrieved user by ID`, {
        userId: id,
        email: user.email,
        context: 'getUserById'
      });

      return user;
    } catch (error) {
      logger.error(`[User] Error retrieving user by ID: ${error.message}`, {
        userId: id,
        error: error.stack,
        context: 'getUserById'
      });
      throw error;
    }
  }

  async me(id) {
    try {
      const user = await userRepository.me(id);

      if (!user) {
        logger.warn(`[User] User profile not found`, { userId: id, context: 'me' });
        const error = new Error('User profile not found');
        error.statusCode = 404;
        throw error;
      }

      logger.info(`[User] Retrieved user profile`, {
        userId: id,
        email: user.email,
        context: 'me'
      });

      return user;
    } catch (error) {
      logger.error(`[User] Error retrieving user profile: ${error.message}`, {
        userId: id,
        error: error.stack,
        context: 'me'
      });
      throw error;
    }
  }

}

export default new UserService();