module.exports = {
	app: {
		title: 'Make It Happen',
		description: 'Application for self organization',
		keywords: 'Make It Happen'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	// The secret should be set to a non-guessable string that
	// is used to compute a session hash
	sessionSecret: 'MEAN',
	// The name of the MongoDB collection to store sessions in
	sessionCollection: 'sessions',
	// The session cookie settings
	sessionCookie: {
		path: '/',
		httpOnly: true,
		// If secure is set to true then it will cause the cookie to be set
		// only when SSL-enabled (HTTPS) is used, and otherwise it won't
		// set a cookie. 'true' is recommended yet it requires the above
		// mentioned pre-requisite.
		secure: false,
		// Only set the maxAge to null if the cookie shouldn't be expired
		// at all. The cookie will expunge when the browser is closed.
		maxAge: null
		// To set the cookie in a specific domain uncomment the following
		// setting:
		// domain: 'yourdomain.com'
	},
	// The session cookie name
	sessionName: 'connect.sid',
	log: {
		// Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
		format: 'combined',
		// Stream defaults to process.stdout
		// Uncomment to enable logging to a log on the file system
		options: {
			stream: 'access.log'
		}
	},
	assets: {
		lib: {
			css: [
				'inspinia/font-awesome/css/font-awesome.css',
				'inspinia/css/bootstrap.min.css',
				'lib/bootstrap/dist/css/bootstrap.css',
				'lib/bootstrap/dist/css/bootstrap-theme.css',
				'lib/angular-ui-notification/dist/angular-ui-notification.css',
				'lib/angularjs-slider/dist/rzslider.min.css',
				'lib/fullcalendar/dist/fullcalendar.css',
				'lib/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
				'lib/angular-loading-bar/build/loading-bar.min.css',
				'lib/ng-dialog/css/ngDialog.css',
				'lib/ng-dialog/css/ngDialog-theme-default.css'
			],
			js: [
				'lib/angular/angular.js',
				'lib/lodash/lodash.js',
				'lib/angular-resource/angular-resource.js',
				'lib/angular-animate/angular-animate.js',
				'lib/angular-ui-router/release/angular-ui-router.js',
				'lib/angular-ui-utils/ui-utils.js',
				'lib/jquery/dist/jquery.js',
				'lib/bootstrap/dist/js/bootstrap.js',
				'lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'lib/angular-ui-notification/dist/angular-ui-notification.js',
				'lib/angular-file-upload/dist/angular-file-upload.js',
				'lib/angularjs-slider/dist/rzslider.js',
				'lib/modelOptions/ngModelOptions.js',
				'lib/angular-strap/dist/angular-strap.min.js',
				'lib/angular-strap/dist/angular-strap.tpl.min.js',
				'lib/owasp-password-strength-test/owasp-password-strength-test.js',
				'lib/moment/min/moment-with-locales.min.js',
				'lib/angular-ui-calendar/src/calendar.js',
				'lib/fullcalendar/dist/fullcalendar.js',
				'lib/fullcalendar/dist/gcal.js',
				'lib/raphael/raphael.min.js',
				'lib/morris.js/morris.min.js',
				'lib/angular-morris-chart/src/angular-morris-chart.min.js',
				'lib/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
				'lib/angular-cookies/angular-cookies.min.js',
				'lib/angular-loading-bar/build/loading-bar.min.js',
				'lib/ng-dialog/js/ngDialog.min.js'
			]
		},
		css: [
			'inspinia/css/*.css',
			'css/app.css'
		],
		js: [
			'config.js',
			'application.js',
			'modules/*/*.js',
			'inspinia/js/directives.js',
			'modules/*/*[!tests]*/*.js'
		],
		tests: [
			'lib/angular-mocks/angular-mocks.js',
			'modules/*/tests/*.js'
		]
	},
	profilesFolder: './modules/users/img/profiles/',
	uploads: {
		profileUpload: {
			dest: './modules/users/img/profiles/', // Profile upload destination path
			limits: {
				fileSize: 3 * 1024 * 1024 // Max file size in bytes (3 MB)
			}
		}
	}
};
