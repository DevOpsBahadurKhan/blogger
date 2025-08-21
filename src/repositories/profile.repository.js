import db from '../models/index.js';
import logger from '../utils/logger.js';

const { Profile, User } = db;

class ProfileRepository {
  async getByUserId(userId) {
    try {
      const profile = await Profile.findOne({ where: { userId } });
      logger.info('[ProfileRepository] getByUserId', { userId, found: !!profile });
      return profile;
    } catch (error) {
      logger.error('[ProfileRepository] Error getByUserId', { userId, error: error.message, stack: error.stack });
      throw error;
    }
  }

  async upsertByUserId(userId, data) {
    try {
      // Ensure the user exists
      const user = await User.findByPk(userId);
      if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
      }

      const [profile, created] = await Profile.findOrCreate({
        where: { userId },
        defaults: { userId, ...data }
      });

      if (!created) {
        await profile.update(data);
      }

      logger.info('[ProfileRepository] upsertByUserId', { userId, created });
      return profile;
    } catch (error) {
      logger.error('[ProfileRepository] Error upsertByUserId', { userId, error: error.message, stack: error.stack });
      throw error;
    }
  }
}

export default new ProfileRepository();
