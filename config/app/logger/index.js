const config = require('./../config/index');
const fs = require('fs');

module.exports = {
  getLogFormat: () => config.log.format,
  getLogOptions() {
    let options = {};

    try {
      if ('stream' in config.log.options) {
        options = {
          stream: fs.createWriteStream(`${ process.cwd() }/${ config.log.options.stream }`),
          flags: 'a'
        };
      }
    } catch (e) {
      options = {};
    }

    return options;
  }
};
