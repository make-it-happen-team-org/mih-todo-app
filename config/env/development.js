'use strict';

module.exports = {
	db: {
		uri: 'mongodb://localhost/mean-test',
		options: {
			user: '',
			pass: ''
		}
	},
	log: {
		// Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
		format: 'dev',
		// Stream defaults to process.stdout
		// Uncomment to enable logging to a log on the file system
		options: {
			//stream: 'access.log'
		}
	},
	app: {
		title: 'MIH - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		// fallback email provider is hardcoded to ensure that
		// email features are working if no env variables provided
		from: process.env.MAILER_FROM || 'testmailerservice1@gmail.com',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'gmail',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'testmailerservice1@gmail.com',
				pass: process.env.MAILER_PASSWORD || 'qwe123rty456'
			}
		}
	},

	outlook: {
		//serverRedirectUrl: 'http://localhost:3000/migrate/outlook/authorize',
		serverRedirectUrl: 'https://make-it-happen-app.herokuapp.com/migrate/outlook/authorize',
		authorizationPath: '/oauth2/v2.0/authorize',
		uiRedirectUrl: '/#!/migrate',
		cookieMaxAge: 100 * 60 * 60 * 5,
		clientSecret: 'FHTnvdXrL15cR5C1ffGiiJe',
		apiEndpoint: 'https://outlook.office.com/api/v2.0',
		calendarUrl: '/me/calendarview',
		tokenPath: '/oauth2/v2.0/token',
		clientID: '18d1debf-1018-4c00-b353-24bac62f294b',
		site: 'https://login.microsoftonline.com/common',
		calendarScopes: [
			'openid',
			'profile',
			'offline_access',
			'https://outlook.office.com/calendars.readwrite'
		],
		headers: [
			'odata.track-changes',
			'odata.maxpagesize=10'
		]
	}
};
