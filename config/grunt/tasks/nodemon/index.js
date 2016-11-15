const watchFiles = require('../../config/watch-files');

module.exports = {
  dev: {
    script: 'server.js',
    options: {
      nodeArgs: ['--debug'],
      ext: 'js,html',
      watch: watchFiles.serverViews.concat(watchFiles.serverJS)
    }
  }
};
