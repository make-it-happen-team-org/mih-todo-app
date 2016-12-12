let passport = require('passport');
const VkontakteStrategyClass = require('passport-vkontakte').Strategy;
const config = require('../config');
const users = require('../../server-app-folder/controllers/users.server.controller');

module.exports = function() {
    let authenticationCallback = function(req, accessToken, refreshToken, params, profile, done) {

      let providerUserProfile = {
        email: params.email,
        provider: 'vkontakte',
      };

      users.saveOAuthUserProfile(req, providerUserProfile, done);
    };

    let vkontakteStrategy = new VkontakteStrategyClass({
      clientID: config.vkontakte.clientID,
      clientSecret: config.vkontakte.clientSecret,
      callbackURL: config.vkontakte.callbackURL,
      scope: config.vkontakte.scope,
      profileFields: config.vkontakte.profileFields,
      passReqToCallback: true
    }, authenticationCallback);

    passport.use(vkontakteStrategy);
};