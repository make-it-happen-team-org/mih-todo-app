const watchFiles = require('../../../config/watch-files');

module.exports = {
  files: watchFiles.serverViews,
  options: {
    livereload: true
  }
};
