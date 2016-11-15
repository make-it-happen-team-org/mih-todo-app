/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */
require('./server/models/user.server.model');
require('./config').setEnvironment();

const config = require('./config/app').config;
const mongoose = require('mongoose');
const chalk = require('chalk');
// Bootstrap db connection
const db = mongoose.connect(config.db.uri, config.db.options, (err) => {
  if (err) {
    /* eslint-disable */
    console.error(chalk.red('Could not connect to MongoDB!'));
    console.log(chalk.red(err));
    /* eslint-enable */
  }
});

mongoose.connection.on('error', (err) => {
  // eslint-disable-next-line
  console.error(chalk.red(`MongoDB connection error: ${ err }`));
  process.exit(-1);
});
// Init the expressConfig application
const app = require('./config/app').express(db);

// Bootstrap passport config
require('./config/app/passport')();
// Start the server by listening on <port>
app.listen(config.port);

// Logging initialization
/* eslint-disable */
console.log('--');
console.log(chalk.green(config.app.title + ' application started'));
console.log(chalk.green('Environment:\t\t\t' + process.env.NODE_ENV));
console.log(chalk.green('Port:\t\t\t\t' + config.port));
console.log(chalk.green('Database:\t\t\t' + config.db.uri));
console.log('--');
/* eslint-enable */

// Expose server
module.exports = app;
