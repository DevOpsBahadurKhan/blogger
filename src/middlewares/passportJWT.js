const passport = require('passport');
const passportJwt = require('passport-jwt');
const { User } = require('../models'); // Sequelize model

const ExtractJwt = passportJwt.ExtractJwt;
const Strategy = passportJwt.Strategy;

const params = {
  secretOrKey: process.env.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

module.exports = () => {
  const strategy = new Strategy(params, async (payload, done) => {
    try {
      const user = await User.findByPk(payload.id); // ✅ Sequelize method
      if (!user) return done(new Error("User not found"), null);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  });

  passport.use(strategy);

  return {
    initialize: () => passport.initialize(),
    authenticate: () => passport.authenticate('jwt', { session: false }),
  };
};
