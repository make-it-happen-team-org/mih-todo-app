/**
 * Module dependencies.
 */

let _ = require('lodash');
let errorHandler = require('../errors.server.controller');
let mongoose = require('mongoose');
let passport = require('passport');
let User = mongoose.model('User');

/**
 * Signup
 */
let signup = function (req, res) {
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;
	// Init Variables
	let user = new User(req.body);
	let message = null;

	// Add missing user fields
	user.provider = 'local';
	user.eventTemplates = [{
		type : 'sick',
		title : 'Sick leave'
	}, {
		type : 'vacation',
		title : 'Vacation'
	}];
	// Then save the user
	user.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			req.login(user, function (err) {
				if (err) {
					res.status(400).send(err);
				} else {
					res.json(user);
				}
			});
		}
	});
};

/**
 * Signin after passport authentication
 */
let signin = function (req, res, next) {
	passport.authenticate('local', function (err, user, info) {
		if (err || !user) {
			res.status(400).send(info);
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			req.login(user, function (err) {
				if (err) {
					res.status(400).send(err);
				} else {
					res.json(user);
				}
			});
		}
	})(req, res, next);
};

/**
 * Signout
 */
let signout = function (req, res) {
	req.logout();
	res.redirect('/#!/signin');
};

/**
 * OAuth callback
 */
let oauthCallback = function (strategy) {
	return function (req, res, next) {
		passport.authenticate(strategy, function (err, user) {
			if (err || !user) {
				return res.redirect('/#!/signin');
			}
			req.login(user, function (err) {
				if (err) {
					return res.redirect('/#!/signin');
				}

				return res.redirect('/#!/todo');
			});
		})(req, res, next);
	};
};

/**
 * Helper function to save or update a OAuth user profile
 */
let saveOAuthUserProfile = function (req, providerUserProfile, done) {

	// Define a search query to find existing user with current provider profile
	let searchQuery = {
		$or: [{email: providerUserProfile.email}]
	};

	User.findOne(searchQuery, function (err, user) {
		if (err) {
			return done(err);
		} else {
			if (!user) {
				user = new User({
					username: providerUserProfile.email,
					email: providerUserProfile.email,
					provider: 'social'
				});

				// And save the user
				user.save(function (err) {
					return done(err, user);
				});
			} else {
				return done(err, user);
			}
		}
	});
};

/**
 * Remove OAuth provider
 */
let removeOAuthProvider = function (req, res, next) {
	let user = req.user;
	let provider = req.param('provider');

	if (user && provider) {
		// Delete the additional provider
		if (user.additionalProvidersData[provider]) {
			delete user.additionalProvidersData[provider];

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');
		}

		user.save(function (err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function (err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	}
};

module.exports = {
	signin: signin,
	signup: signup,
	signout: signout,
	oauthCallback: oauthCallback,
	saveOAuthUserProfile: saveOAuthUserProfile,
	removeOAuthProvider: removeOAuthProvider
};