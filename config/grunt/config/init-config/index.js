const grunt = require('grunt');
const tasks = require('../../tasks');

module.exports = {
  pkg: grunt.file.readJSON('package.json'),
  babel: tasks.babel,
  clean: tasks.clean,
  concurrent: tasks.concurrent,
  csslint: tasks.cssLint,
  cssmin: tasks.cssMin,
  env: tasks.env,
  jshint: tasks.jsHint,
  karma: tasks.karma,
  less: tasks.less,
  mochaTest: tasks.mochatests,
  ngAnnotate: tasks.ngAnnotate,
  'node-inspector': tasks.nodeInspector,
  nodemon: tasks.nodemon,
  uglify: tasks.uglify,
  watch: {
    allES6: tasks.watch.alles2015,
    clientCSS: tasks.watch.clientCss,
    clientLESS: tasks.watch.clientLess,
    clientViews: tasks.watch.clientViews,
    mochaTests: tasks.watch.mochaTests,
    serverViews: tasks.watch.serverViews
  }
};
