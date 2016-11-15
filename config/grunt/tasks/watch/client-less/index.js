const watchFiles = require('../../../config/watch-files');

module.exports = {
  files: watchFiles.clientLESS,
  tasks: ['build-less'],
  options: {
    livereload: true
  }
};
