import profileService from '../services/profile.service.js';
import logger from '../utils/logger.js';

export const getByUserId = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const profile = await profileService.getByUserId(userId);

    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    logger.error('[ProfileController] getByUserId error', { error: error.message, stack: error.stack, userId: req.params.userId });
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profile = await profileService.getByUserId(userId);
    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    logger.error('[ProfileController] getMe error', { error: error.message, stack: error.stack, userId: req.user?.id });
    next(error);
  }
};

export const upsertByUserId = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const data = req.body;

    const profile = await profileService.upsertByUserId(userId, data);
    return res.status(200).json({ success: true, message: 'Profile saved', data: profile });
  } catch (error) {
    logger.error('[ProfileController] upsertByUserId error', { error: error.message, stack: error.stack, userId: req.params.userId, body: req.body });
    next(error);
  }
};
