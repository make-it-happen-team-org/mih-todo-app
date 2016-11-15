const watchFiles = require('../../config/watch-files');

module.exports = {
  es6: {
    files: [
      {
        expand: true,
        src: watchFiles.allES6,
        ext: '.js',
        extDot: 'last'
      }
    ]
  }
};
