module.exports = (grunt) => {
  // Default task(s).
  grunt.registerTask('default', ['buildIndexFile', 'server']);
  grunt.registerTask('server', ['build', 'minify', 'env:development', 'concurrent:server']);

  // Development tasks - when external server is needed (e.g. debug through IDE)
  grunt.registerTask('dev', ['build', 'watch']);

  // Debug task.
  grunt.registerTask('debug', ['build', 'concurrent:debug']);

  // Lint task(s).
  grunt.registerTask('lint', ['jshint']);

  // Build task(s).
  grunt.registerTask('build', ['concurrent:buildSrc', 'lint']);
  grunt.registerTask('build-less', ['less']);
  grunt.registerTask('build-es6', ['clean:compiledJs', 'loadConfig', 'babel:es6', 'ngAnnotate']);
  grunt.registerTask('minify', ['concurrent:minifySrc']);

  // Test task.
  grunt.registerTask('test', ['karma:unit']);

  grunt.task.registerTask('buildIndexFile', () => {
    require('../init')();

    const config = require('../config');

    grunt.file.setBase('public/');

    config.assets.cssFullPath = [];
    config.assets.css.forEach((pattern) => {
      config.assets.cssFullPath.push(grunt.file.expand(pattern));
    });

    config.assets.jsFullPath = [];
    config.assets.js.forEach((pattern) => {
      config.assets.jsFullPath.push(grunt.file.expand(pattern));
    });

    grunt.file.write(
      'index.html',
      grunt.template.process(
        grunt.file.read('index.template.html'),
        { data: config }
      )
    )
  });

  // A Task for loading the configuration object
  grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', () => {
    require('../init')();

    const config = require('../config');

    grunt.config.set('applicationJavaScriptFiles', config.assets.js);
    grunt.config.set('applicationCSSFiles', config.assets.css);
  });
};
