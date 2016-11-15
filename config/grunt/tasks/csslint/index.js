const watchFiles = require('../../config/watch-files');

module.exports = {
  options: {
    csslintrc: '.csslintrc'
  },
  all: {
    src: watchFiles.clientCSS
  }
};
