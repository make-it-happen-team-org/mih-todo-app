module.exports = (grunt) => {
    // Development tasks - when external server is needed (e.g. debug through IDE)
    grunt.registerTask('develop', [
        'env:development',
        'loadConfig',
        'clean',
        'less',
        'babel',
        'buildIndexFile'
    ]);

    // Build task(s).
    grunt.registerTask('build', ['env:production', 'concurrent:buildSrc', 'concurrent:minifySrc']);

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
                {data: config}
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