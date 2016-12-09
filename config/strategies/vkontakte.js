var passport = require('passport'),
    VkontakteStrategy = require('passport-vkontakte').Strategy,
    config = require('../config'),
    users = require('../../server-app-folder/controllers/users.server.controller');

module.exports = function() {
    passport.use(new VkontakteStrategy({
        clientID: config.vkontakte.clientID,
        clientSecret: config.vkontakte.clientSecret,
        callbackURL: config.vkontakte.callbackURL,
        scope: config.vkontakte.scope,
        profileFields: config.vkontakte.profileFields,
        passReqToCallback: true
    }, function(req, accessToken, refreshToken, params, profile, done) {

        debugger;
        var providerUserProfile = {
            email: params.email,
            provider: 'vkontakte',
        };

        users.saveOAuthUserProfile(req, providerUserProfile, done);
    }));
};