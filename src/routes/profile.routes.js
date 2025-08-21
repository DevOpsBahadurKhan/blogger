import express from 'express';
import passportJWT from '../middlewares/passportJWT.js';
import verifyAccess from '../middlewares/verifyAccess.js';
import { getByUserId, getMe, upsertByUserId } from '../controllers/profile.controller.js';

const router = express.Router();

// Current user profile
router.get('/me', passportJWT.authenticate(), getMe);

// Get profile by userId (admin or permitted roles)
router.get('/:userId',
  passportJWT.authenticate(),
  verifyAccess('read', 'profile', 'any'),
  getByUserId
);

// Upsert profile for a user (owner by default; admin allowed via update:any)
router.put('/:userId',
  passportJWT.authenticate(),
  verifyAccess('update', 'profile', 'own'),
  upsertByUserId
);

export default router;
