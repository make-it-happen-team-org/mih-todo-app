const config = require('../config');
const glob = require('glob');
const chalk = require('chalk');
const ENV = process.env.NODE_ENV;
const setEnvironment  = () => {
  glob(`./app/env/${ ENV }`, { sync: true }, (err, environmentFiles) => {
    const noConfigFileMsg = ` No configuration file found for ${ ENV } environment using development instead`;

    if (!environmentFiles.length) {
      if (process.env.NODE_ENV) {
        // eslint-disable-next-line
        console.error(chalk.red(noConfigFileMsg));
      } else {
        // eslint-disable-next-line
        console.error(chalk.red('NODE_ENV is not defined! Using default development environment'));
      }
      process.env.NODE_ENV = 'development';
    }
  });
};

module.exports = setEnvironment;

module.exports = {
  config,
  setEnvironment
};
