import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import db from '../models/index.js';
const { User } = db;

const params = {
  secretOrKey: process.env.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

export default () => {
  const strategy = new JwtStrategy(params, async (payload, done) => {
    try {
      const user = await User.findByPk(payload.id);
      if (!user) return done(new Error('User not found'), null);
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
