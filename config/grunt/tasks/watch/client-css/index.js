const watchFiles = require('../../../config/watch-files');

module.exports = {
  files: watchFiles.clientCSS,
  tasks: ['csslint'],
  options: {
    livereload: true
  }
};
