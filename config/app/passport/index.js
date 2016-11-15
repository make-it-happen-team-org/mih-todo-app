const passport = require('passport');
const User = require('mongoose').model('User');
const path = require('path');
const config = require('./../config');

module.exports = () => {
  // Serialize sessions
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  // Deserialize sessions
  passport.deserializeUser((id, done) => {
    User.findOne({ _id: id }, '-salt -password', (err, user) => {
      done(err, user);
    });
  });
  // Initialize strategies
  config.getGlobbedFiles('./config/strategies/**/*.js').forEach((strategy) => {
    require(path.resolve(strategy))();
  });
};
