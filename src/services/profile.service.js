import profileRepo from '../repositories/profile.repository.js';
import logger from '../utils/logger.js';

class ProfileService {
  async getByUserId(userId) {
    try {
      const profile = await profileRepo.getByUserId(userId);
      if (!profile) {
        logger.info('[ProfileService] No profile found', { userId });
      }
      return profile;
    } catch (error) {
      logger.error('[ProfileService] Error getByUserId', { userId, error: error.message, stack: error.stack });
      throw error;
    }
  }

  async upsertByUserId(userId, data) {
    try {
      const profile = await profileRepo.upsertByUserId(userId, data);
      logger.info('[ProfileService] upsertByUserId', { userId });
      return profile;
    } catch (error) {
      logger.error('[ProfileService] Error upsertByUserId', { userId, data, error: error.message, stack: error.stack });
      throw error;
    }
  }
}

export default new ProfileService();
