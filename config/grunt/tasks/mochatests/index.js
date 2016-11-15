const watchFiles = require('../../config/watch-files');

module.exports = {
  src: watchFiles.mochaTests,
  options: {
    reporter: 'spec',
    require: 'server.js'
  }
};
