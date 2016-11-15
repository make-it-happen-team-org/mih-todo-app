const watchFiles = require('../../../config/watch-files');

module.exports = {
  files: watchFiles.allES6,
  tasks: ['build-es6', 'jshint'],
  options: {
    livereload: true
  }
};
