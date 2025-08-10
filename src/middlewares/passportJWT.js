import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import logger from '../utils/logger.js';
import db from '../models/index.js';

const { User, Role } = db;

const params = {
  secretOrKey: process.env.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

export default () => {
  const strategy = new JwtStrategy(params, async (payload, done) => {
    try {
      const user = await User.findByPk(payload.id, {
        include: {
          model: Role,
          as: 'role',
          attributes: ['id', 'name'],
        },
      });

      if (!user) return done(new Error('User not found'), null);

      // Store roleId before overwriting role with name
      const roleObj = user.role; 
      user.roleId = roleObj?.id;
      user.role = roleObj?.name; // keep string for Casbin

      logger.info('User authenticated', {
        userId: user.id,
        role: user.role,
        roleId: user.roleId,
        email: user.email
      });

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  });

  passport.use(strategy);

  return {
    initialize: () => passport.initialize(),
    authenticate: () => passport.authenticate('jwt', { session: false }),
  };
};
