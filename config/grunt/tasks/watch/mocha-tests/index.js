const watchFiles = require('../../../config/watch-files');

module.exports = {
  files: watchFiles.mochaTestsES6,
  tasks: ['test:server']
};
