require('./models/user.server.model');
require('../config/init')();

const config = require('../config/config');
const mongoose = require('mongoose');
const chalk = require('chalk');
const mongoHandler = (err) => {
  if (err) {
    console.error(chalk.red('Could not connect to MongoDB!'));
    console.log(chalk.red(err));
  }
};
const db = mongoose.connect(config.db.uri, config.db.options, mongoHandler);
const app = require('../config/express')(db);

mongoose.connection.on('error', function(err) {
    console.error(chalk.red(`MongoDB connection error: ${ err }`));
    process.exit(-1);
  }
);

// Bootstrap passport config
require('../config/passport')();

// Start the server-app-folder by listening on <port>
app.listen(config.port);

// Expose server-app-folder
exports = module.exports = app;

// Logging initialization
console.log('--');
console.log(chalk.green(`${ config.app.title } application started`));
console.log(chalk.green(`Environment:\t\t\t${ process.env.NODE_ENV }`));
console.log(chalk.green(`Port:\t\t\t\t${ config.port }`));
console.log(chalk.green(`Database:\t\t\t${ config.db.uri }`));
console.log('--');
