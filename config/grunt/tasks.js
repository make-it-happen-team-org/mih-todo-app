const watchFiles = require('./watch-files');

/** MAIN **/

const env = {
    development: {
        NODE_ENV: 'development'
    },
    production: {
        NODE_ENV: 'production'
    },
    test: {
        NODE_ENV: 'test'
    }
};

const less = {
    options: {
        plugins: [new (require('less-plugin-autoprefix'))({browsers: ["last 3 versions"]})],
        rootpath: 'public'
    },
    dev: {
        files: {
            'public/css/app.main.css': 'public/less/app.main.less'
        }
    }
};

const babel = {
    es6: {
        files: [
            {
                expand: true,
                src: watchFiles.allES6,
                ext: '.js',
                extDot: 'last'
            }
        ]
    }
};

const clean = {
    compiledJs: [
        'public/modules/**/*.js', 'public/modules/**/*.js.map'
    ]
};

const watch = {
    clientViews: {
        files: watchFiles.clientViews,
        options: {
            livereload: true
        }
    },
    allES6: {
        files: watchFiles.allES6,
        tasks: ['build-es6', 'jshint'],
        options: {
            livereload: true
        }
    },
    clientCSS: {
        files: watchFiles.clientCSS,
        tasks: ['csslint'],
        options: {
            livereload: true
        }
    },
    clientLESS: {
        files: watchFiles.clientLESS,
        tasks: ['less'],
        options: {
            livereload: true
        }
    }
};

/** PRODUCTION **/

const ngAnnotate = {
    production: {
        files: {
            'public/dist/js/main.js': '<%= applicationJavaScriptFiles %>'
        }
    }
};

const uglify = {
    production: {
        options: {
            mangle: false
        },
        files: {
            'public/dist/js/main.min.js': 'public/dist/js/main.js'
        }
    }
};

const cssmin = {
    combine: {
        files: {
            'public/dist/application.min.css': '<%= applicationCSSFiles %>'
        }
    }
};

/** ADDITIONAL **/

const jshint = {
    all: {
        src: watchFiles.clientJS,
        options: {
            jshintrc: true
        }
    }
};

const concurrent = {
    buildSrc: ['less', 'build-es6'],
    minifySrc: ['cssmin', 'uglify'],
    options: {
        logConcurrentOutput: true,
        limit: 10
    }
};

const karma = {
    unit: {
        configFile: 'karma.conf.js'
    }
};

const pkg = require('grunt').file.readJSON('package.json');

module.exports = {
    pkg,
    watch,
    less,
    jshint,
    uglify,
    cssmin,
    babel,
    ngAnnotate,
    concurrent,
    env,
    karma,
    clean
};
