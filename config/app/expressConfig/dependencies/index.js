const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const compression = require('compression');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const passport = require('passport');
const consolidate = require('consolidate');
const flash = require('connect-flash');
const path = require('path');
const MongoStore = require('connect-mongo')({ session });

module.exports = {
  express,
  morgan,
  bodyParser,
  session,
  compression,
  methodOverride,
  cookieParser,
  helmet,
  passport,
  consolidate,
  flash,
  path,
  MongoStore
};
