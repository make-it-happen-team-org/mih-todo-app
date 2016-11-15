const watchFiles = require('../../../config/watch-files');

module.exports = {
  files: watchFiles.clientViews,
  options: {
    livereload: true
  }
};
