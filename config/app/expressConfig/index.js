const dependencies = require('./dependencies');
const setConfig = require('./setConfig');
const config = require('../config');
const logger = require('../logger');

// Initialize expressConfig server
const app = dependencies.express();
const expressConfig = {
  app,
  config,
  dependencies
};

// eslint-disable-next-line
module.exports = (db) => {
  // Globbing model files
  config.getGlobbedFiles('./server/models/**/*.js').forEach((modelPath) => {
    // eslint-disable-next-line
    require(dependencies.path.resolve(modelPath));
  });
  setConfig.setLocalVariables(expressConfig);
  // Passing the request url to environment locals
  app.use((req, res, next) => {
    res.locals.url = `${ req.protocol }://${ req.headers.host }${ req.url }`;
    next();
  });
  // Should be placed before expressConfig.static
  app.use(dependencies.compression({
    // only compress files for the following content types
    filter(req, res) {
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    level: 3
  }));
  // Showing stack errors
  app.set('showStackError', true);
  // Set swig as the template engine
  app.engine('server.view.html', dependencies.consolidate[config.templateEngine]);
  // Set views path and view engine
  app.set('view engine', 'server.view.html');
  app.set('views', './server/views');
  // Enable logger (morgan)
  app.use(dependencies.morgan(logger.getLogFormat(), logger.getLogOptions()));
  setConfig.setMiddleWare(expressConfig);
  setConfig.setBodyParser(expressConfig);
  setConfig.setHemlet(expressConfig);
  // Setting the server router and static folder
  app.use(dependencies.express.static(dependencies.path.resolve('./public')));
  // CookieParser should be above session
  app.use(dependencies.cookieParser());
  setConfig.setMongoDb(expressConfig, db);
  setConfig.setPassport(expressConfig);
  // connect flash for flash messages
  app.use(dependencies.flash());
  // Globbing routing files
  config.getGlobbedFiles('./server/routes/**/*.js').forEach((routePath) => {
    // eslint-disable-next-line
    require(dependencies.path.resolve(routePath))(app);
  });
  // Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
  app.use((err, req, res, next) => {
    // If the error object doesn't exists
    if (!err) {
      return next();
    }
    // Log it
    // eslint-disable-next-line
    console.error(err.stack);
    // Error page
    res.status(500).render('500', {
      error: err.stack
    });

    return err;
  });
  // Assume 404 since no middleware responded
  app.use((req, res) => {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not Found'
    });
  });

  return app;
};

