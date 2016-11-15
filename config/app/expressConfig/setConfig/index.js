const setLocalVariables = (expressConfig) => {
  expressConfig.app.locals.title = expressConfig.config.app.title;
  expressConfig.app.locals.description = expressConfig.config.app.description;
  expressConfig.app.locals.keywords = expressConfig.config.app.keywords;
  expressConfig.app.locals.jsFiles = expressConfig.config.getJavaScriptAssets();
  expressConfig.app.locals.cssFiles = expressConfig.config.getCSSAssets();
};
const setBodyParser = (expressConfig) => {
  expressConfig.app.use(expressConfig.dependencies.bodyParser.urlencoded({ extended: true })); // eslint-disable-line
  expressConfig.app.use(expressConfig.dependencies.bodyParser.json()); // eslint-disable-line
  expressConfig.app.use(expressConfig.dependencies.methodOverride()); // eslint-disable-line
};
const setMiddleWare = (expressConfig) => {
  switch (process.env.NODE_ENV) {
    case 'development': {
      // Disable views cache
      expressConfig.app.set('view cache', false);
      break;
    }
    case 'production': {
      expressConfig.app.locals.cache = 'memory';
      break;
    }
    default: {
      // Disable views cache
      expressConfig.config.app.set('view cache', false);
      break;
    }
  }
};
const setHemlet = (expressConfig) => {
  expressConfig.app.use(expressConfig.dependencies.helmet.xframe());
  expressConfig.app.use(expressConfig.dependencies.helmet.xssFilter());
  expressConfig.app.use(expressConfig.dependencies.helmet.nosniff());
  expressConfig.app.use(expressConfig.dependencies.helmet.ienoopen());
  expressConfig.app.disable('x-powered-by');
};
const setMongoDb = (expressConfig, db) => {
  // Express MongoDB session storage
  expressConfig.app.use(expressConfig.dependencies.session({ // eslint-disable-line
    saveUninitialized: true,
    resave: true,
    secret: expressConfig.config.sessionSecret,
    store: new expressConfig.dependencies.MongoStore({ // eslint-disable-line
      db: db.connection.db,
      collection: expressConfig.config.sessionCollection
    }),
    cookie: expressConfig.config.sessionCookie,
    name: expressConfig.config.sessionName
  }));
};
const setPassport = (expressConfig) => {
  expressConfig.app.use(expressConfig.dependencies.passport.initialize()); // eslint-disable-line
  expressConfig.app.use(expressConfig.dependencies.passport.session()); // eslint-disable-line
};

module.exports = {
  setLocalVariables,
  setBodyParser,
  setMiddleWare,
  setHemlet,
  setMongoDb,
  setPassport
};
