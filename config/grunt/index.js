const tasks = require('./tasks');
const watchFiles = require('./config').watchFiles;
const initConfig = require('./config').initConfig;

module.exports = {
  tasks,
  config: {
    watchFiles,
    initConfig
  }
};
