const watchFiles = require('../../config/watch-files');

module.exports = {
  dist: {
    files: [{
      expand: true,
      src: watchFiles.clientLESS,
      ext: '.css',
      rename: (base, src) => src.replace('/less/', '/css/')
    }]
  }
};
