'use strict';

var fs = require('fs');

module.exports = function (grunt) {
  // Unified Watch Object
  var watchFiles = {
    serverViews:   ['server-app-folder/views/**/*.*'],
    serverJS:      ['gruntfile.js', 'server-app-folder/server.js', 'config/**/*.js', 'server-app-folder/**/*.js', '!server-app-folder/tests/'],
    clientViews:   ['public/modules/**/views/**/*.html'],
    clientJS:      ['public/js/**/*.js', 'public/**/*.es6', '!public/**/*.compiled.js'],
    allES6:        ['public/**/*.es6', 'server-app-folder/**/*.es6'],
    clientCSS:     ['public/assets/**/*.css'],
    clientLESS:    ['public/**/*.less', '!public/lib/**/*.less'],
    mochaTestsES6: ['server-app-folder/tests/**/*.es6'],
    mochaTests:    ['server-app-folder/tests/**/*.js']
  };

  grunt.loadNpmTasks('grunt-autoprefixer');

  // Project Configuration
  grunt.initConfig({
    pkg:              grunt.file.readJSON('package.json'),
    watch:            {
      serverViews: {
        files:   watchFiles.serverViews,
        options: {
          livereload: true
        }
      },
      clientViews: {
        files:   watchFiles.clientViews,
        options: {
          livereload: true
        }
      },
      allES6:      {
        files:   watchFiles.allES6,
        tasks:   ['build-es6', 'jshint'],
        options: {
          livereload: true
        }
      },
      clientCSS:   {
        files:   watchFiles.clientCSS,
        tasks:   ['csslint'],
        options: {
          livereload: true
        }
      },
      clientLESS:  {
        files:   watchFiles.clientLESS,
        tasks:   ['build-less'],
        options: {
          livereload: true
        }
      }
    },
    less:             {
      options : {
        plugins : [ new (require('less-plugin-autoprefix'))({browsers : [ "last 3 versions" ]}) ]
      },
      dist: {
        files:   [{
          expand: true,
          src:    'public/less/app.main.less',
          dest:   'public/dist/css',
          ext:    '.css',
          rename: function (base) {
            return `${ base }/main.css`;
          }
        }]
      }
    },
    jshint:           {
      all: {
        src:     watchFiles.clientJS.concat(watchFiles.serverJS),
        options: {
          jshintrc: true
        }
      }
    },
    uglify:           {
      production: {
        options: {
          mangle: false
        },
        files:   {
          'public/dist/js/main.min.js': 'public/dist/js/main.js'
        }
      }
    },
    cssmin:           {
      combine: {
        files: {
          'public/dist/application.min.css': '<%= applicationCSSFiles %>'
        }
      }
    },
    babel:            {
      es6: {
        files: [
          {
            expand: true,
            src:    watchFiles.allES6,
            ext:    '.js',
            extDot: 'last'
          }
        ]
      }
    },
    nodemon:          {
      dev: {
        script:  'server-app-folder/server.js',
        options: {
          nodeArgs: ['--debug'],
          ext:      'js,html',
          watch:    watchFiles.serverViews.concat(watchFiles.serverJS)
        }
      }
    },
    'node-inspector': {
      custom: {
        options: {
          'web-port':          1337,
          'web-host':          'localhost',
          'debug-port':        5858,
          'save-live-edit':    true,
          'no-preload':        true,
          'stack-trace-limit': 50,
          'hidden':            []
        }
      }
    },
    ngAnnotate:       {
      production: {
        files: {
          'public/dist/js/main.js': '<%= applicationJavaScriptFiles %>'
        }
      }
    },
    concurrent:       {
      server:    ['nodemon', 'watch'],
      debug:     ['nodemon', 'watch', 'node-inspector'],
      buildSrc:  ['build-less', 'build-es6'],
      minifySrc: ['cssmin', 'uglify'],
      options:   {
        logConcurrentOutput: true,
        limit:               10
      }
    },
    env:              {
      development: {
        NODE_ENV: 'development'
      },
      production:  {
        NODE_ENV: 'production'
      },
      test:        {
        NODE_ENV: 'test'
      },
    },
    karma:            {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    clean:            {
      compiledJs: [
        'public/modules/**/*.js', 'public/modules/**/*.js.map',
        'server-app-folder/**/*.js', 'server-app-folder/**/*.js.map', '!server-app-folder/server.js'
      ]
    }
  });

  // Load NPM tasks
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  // A Task for loading the configuration object
  grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function () {
    var init   = require('./config/init')();
    var config = require('./config/config');

    grunt.config.set('applicationJavaScriptFiles', config.assets.js);
    grunt.config.set('applicationCSSFiles', config.assets.css);
  });

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

  grunt.task.registerTask('buildIndexFile', function () {
    require('./config/init')();
    var config = require('./config/config');

    grunt.file.setBase('public/');

    config.assets.cssFullPath = [];
    config.assets.css.forEach(function (pattern) {
      config.assets.cssFullPath.push(grunt.file.expand(pattern));
    });

    config.assets.jsFullPath = [];
    config.assets.js.forEach(function (pattern) {
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
};
