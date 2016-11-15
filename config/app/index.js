const config = require('./config');
const env = require('./env');
const express = require('./expressConfig');
const logger = require('./logger');
const passport = require('./passport');

module.exports = {
  config,
  env,
  express,
  logger,
  passport
};
