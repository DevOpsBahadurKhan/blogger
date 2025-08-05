import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
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
          attributes: ['name'],
        },
      });

      if (!user) return done(new Error('User not found'), null);

      // ✅ Attach plain role name for access control
      user.role = user.role?.name;

      console.log('[Auth] User loaded with role:', user.role);

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
