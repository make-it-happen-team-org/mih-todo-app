const initConfig = require('./config/grunt/config').initConfig;

// eslint-disable-next-line
module.exports = (grunt) => {
  // Project Configuration
  grunt.initConfig(initConfig);

  // Load NPM tasks
// eslint-disable-next-line
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-contrib-clean');
  // Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  // A Task for loading the configuration object
  grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', () => {
    require('./config').setEnvironment(); // eslint-disable-line
    const config = require('./config/app/config'); // eslint-disable-line

    grunt.config.set('applicationJavaScriptFiles', config.assets.js);
    grunt.config.set('applicationCSSFiles', config.assets.css);
  });

  // Default task(s).
  grunt.registerTask('default', ['server']);
  grunt.registerTask('server', ['build', 'minify', 'env:development', 'concurrent:server']);

  // Development tasks - when external server is needed (e.g. debug through IDE)
  grunt.registerTask('dev', ['build', 'watch']);

  // Debug task.
  grunt.registerTask('debug', ['build', 'concurrent:debug']);

  // Lint task(s).
  grunt.registerTask('lint', ['jshint', 'csslint']);

  // Build task(s).
  grunt.registerTask('build', ['concurrent:buildSrc', 'lint']);
  grunt.registerTask('build-less', ['less']);
  grunt.registerTask('build-es6', ['clean:compiledJs', 'loadConfig', 'babel:es6', 'ngAnnotate']);
  grunt.registerTask('minify', ['concurrent:minifySrc']);

  // Test task.
  grunt.registerTask('test', ['test:server', 'test:client']);
  grunt.registerTask('test:server', ['clean:compiledJs', 'babel:es6', 'env:test', 'mochaTest']);
  grunt.registerTask('test:client', ['clean:compiledJs', 'babel:es6', 'env:test', 'karma:unit']);
};
