const watchFiles = require('../../config/watch-files');

module.exports = {
  all: {
    src: watchFiles.clientJS.concat(watchFiles.serverJS),
    options: {
      jshintrc: true
    }
  }
};
