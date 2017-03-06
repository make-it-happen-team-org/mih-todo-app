module.exports = (grunt) => {
  grunt.registerTask('default', [ 'develop' ]);

  grunt.registerTask('browser', [
    'env:mobile',
    'loadConfig:browser',
    'clean',
    'less',
    'babel',
    'index'
  ]);

  grunt.registerTask('cordova', [
    'env:mobile',
    'loadConfig:cordova',
    'clean',
    'less',
    'babel',
    'index'
  ]);

  grunt.task.registerTask('index', () => {
    grunt.file.write(
      'index.html',
      grunt.template.process(
        grunt.file.read('index.template.html'),
        {data: grunt.config.get('config')}
      )
    )
  });

  // A Task for loading the configuration object
  grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', platform => {
    const init = require('../init');
    const config = require('../config');

    init();
    grunt.file.setBase('www/');

    config.assets.cssFullPath = [];
    config.assets.css.forEach((path) => {
      const filePath = /\*/.test(path) ? grunt.file.expand(path) : [path];

      config.assets.cssFullPath.push(filePath);
    });

    config.assets.jsFullPath = [];

    if (platform === 'cordova') {
      config.assets.jsFullPath.push([config.assets.cordova]);
      config.endpointUrl = process.env.MIH_URL || config.endpointUrl;
    }

    config.assets.js.forEach((path) => {
      const filePath = /\*/.test(path) ? grunt.file.expand(path) : [path];

      config.assets.jsFullPath.push(filePath);
    });

    grunt.config.set('config', config);
  });

  // Test task.
  grunt.registerTask('test', ['karma:unit']);
};