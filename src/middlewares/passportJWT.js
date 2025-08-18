import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import db from '../models/index.js';

const User = db.User;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

const strategy = new JwtStrategy(options, async (payload, done) => {
  try {
    // Load user with roles so downstream verifyAccess() has a role string
    const user = await User.findByPk(payload.id, {
      include: [
        // Association alias is commonly 'roles'. If the alias differs, adjust in models.
        { model: db.Role, as: 'roles', through: { attributes: [] } }
      ]
    });

    if (!user) return done(null, false);

    // Derive a single role name expected by access control (first role if multiple)
    const rolesArr = Array.isArray(user.roles) ? user.roles : [];
    const roleName = rolesArr.length > 0 ? rolesArr[0].name : null;
    // Attach for middleware consumption
    user.role = roleName;

    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
});

passport.use(strategy);

export default {
  initialize: () => passport.initialize(),
  authenticate: () => passport.authenticate('jwt', { session: false })
};

