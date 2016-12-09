'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy,
	config = require('../config'),
	users = require('../../server-app-folder/controllers/users.server.controller');

module.exports = function() {
	// Use facebook strategy
	passport.use(new FacebookStrategy({
			clientID: config.facebook.clientID,
			clientSecret: config.facebook.clientSecret,
			callbackURL: config.facebook.callbackURL,
			profileFields: config.facebook.profileFields,
			passReqToCallback: true
		},
		function(req, accessToken, refreshToken, profile, done) {
			// Create the user OAuth profile
			var providerUserProfile = {
				email: profile.emails[0].value,
				provider: 'facebook',
			};

			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);
		}
	));
};
