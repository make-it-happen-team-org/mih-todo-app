'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	TwitterStrategy = require('passport-twitter').Strategy,
	config = require('../config'),
	users = require('../../server-app-folder/controllers/users.server.controller');

module.exports = function() {
	// Use twitter strategy
	passport.use(new TwitterStrategy({
			consumerKey: config.twitter.clientID,
			consumerSecret: config.twitter.clientSecret,
			callbackURL: config.twitter.callbackURL,
			includeEmail: true,
			passReqToCallback: true
		},
		function(req, token, tokenSecret, profile, done) {
			// Create the user OAuth profile
			var providerUserProfile = {
				email: profile.emails[0].value,
				provider: 'twitter',
			};

			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);
		}
	));
};
