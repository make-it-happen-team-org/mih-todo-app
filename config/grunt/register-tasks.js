module.exports = (grunt) => {
    // Development tasks - when external server is needed (e.g. debug through IDE)
    grunt.registerTask('develop', [
        'env:development',
        'loadConfig',
        'clean',
        'less',
        'babel',
        'buildDevIndex'
    ]);
    grunt.registerTask('default', [ 'develop' ]);

    // Build task(s).
    grunt.registerTask('prebuild', [
        'env:development',
        'loadConfig',
        'less:prod',
        'ngAnnotate',
        'htmlmin',
        'copy:prodImg',
        'copy:prodFonts',
        'uglify'
    ]);
    grunt.registerTask('build', [
        'env:production',
        'loadConfig',
        'buildProdIndex'
    ]);
    grunt.task.registerTask('buildProdIndex', () => {
        grunt.file.write(
            'build/index.html',
            grunt.template.process(
                grunt.file.read('index.template.html'),
                {data: grunt.config.get('config')}
            )
        )
    });
    grunt.task.registerTask('buildDevIndex', () => {
        grunt.file.write(
            'index.html',
            grunt.template.process(
                grunt.file.read('index.template.html'),
                {data: grunt.config.get('config')}
            )
        )
    });

    // A Task for loading the configuration object
    grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', () => {
        const init = require('../init');
        const config = require('../config');

        init();
        grunt.file.setBase('public/');

        config.assets.cssFullPath = [];
        config.assets.css.forEach((path) => {
            const filePath = /\*/.test(path) ? grunt.file.expand(path) : [path];

            config.assets.cssFullPath.push(filePath);
        });

        config.assets.jsFullPath = [];
        config.assets.js.forEach((path) => {
            const filePath = /\*/.test(path) ? grunt.file.expand(path) : [path];

            config.assets.jsFullPath.push(filePath);
        });

        grunt.config.set('config', config);
    });

    // Test task.
    grunt.registerTask('test', ['karma:unit']);
};