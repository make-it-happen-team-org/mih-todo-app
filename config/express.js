const fs             = require('fs');
const http           = require('http');
const https          = require('https');
const express        = require('express');
const morgan         = require('morgan');
const logger         = require('./logger');
const bodyParser     = require('body-parser');
const session        = require('express-session');
const compression    = require('compression');
const methodOverride = require('method-override');
const cookieParser   = require('cookie-parser');
const helmet         = require('helmet');
const passport       = require('passport');
const mongoStore     = require('connect-mongo')({
  session: session
});
const flash          = require('connect-flash');
const config         = require('./config');
const consolidate    = require('consolidate');
const path           = require('path');

module.exports = function (db) {
  // Initialize express server-app-folder
  const app = express();

  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
  });

  // Globbing model files
  config.getGlobbedFiles('./server-app-folder/models/**/*.js').forEach(function (modelPath) {
    require(path.resolve(modelPath));
  });

  // Setting application local variables
  app.locals.title       = config.app.title;
  app.locals.description = config.app.description;
  app.locals.keywords    = config.app.keywords;
  app.locals.jsFiles     = config.getJavaScriptAssets();
  app.locals.cssFiles    = config.getCSSAssets();

  // Passing the request url to environment locals
  app.use(function (req, res, next) {
    res.locals.url = req.protocol + '://' + req.headers.host + req.url;
    next();
  });

  // Should be placed before express.static
  app.use(compression({
    // only compress files for the following content types
    filter: function (req, res) {
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    // zlib option for compression level
    level: 3
  }));

  // Showing stack errors
  app.set('showStackError', true);

  // Set swig as the template engine
  app.engine('server.view.html', consolidate[config.templateEngine]);

  // Set views path and view engine
  app.set('view engine', 'server.view.html');
  app.set('views', './server-app-folder/views');

  // Enable logger (morgan)
  app.use(morgan(logger.getLogFormat(), logger.getLogOptions()));

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Disable views cache
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
  }

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  // Use helmet to secure Express headers
  app.use(helmet.xframe());
  app.use(helmet.xssFilter());
  app.use(helmet.nosniff());
  app.use(helmet.ienoopen());
  app.disable('x-powered-by');

  // Setting the server-app-folder router and static folder
  app.use(express.static(path.resolve(config.appFolder)));

  // CookieParser should be above session
  app.use(cookieParser());

  // Express MongoDB session storage
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    store: new mongoStore({
      db: db.connection.db,
      collection: config.sessionCollection
    }),
    cookie: config.sessionCookie,
    name: config.sessionName
  }));

  // use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  // connect flash for flash messages
  app.use(flash());

  // Globbing routing files
  config.getGlobbedFiles('./server-app-folder/routes/**/*.js').forEach(function (routePath) {
    require(path.resolve(routePath))(app);
  });

  // Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
  app.use(function (err, req, res, next) {
    // If the error object doesn't exists
    if (!err) return next();

    // Log it
    console.error(err.stack);

    // Error page
    res.status(500).render('500', {
      error: err.stack
    });
  });

  // Assume 404 since no middleware responded
  app.use(function (req, res) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not Found'
    });
  });

  // Return Express server instance
  return app;
};
