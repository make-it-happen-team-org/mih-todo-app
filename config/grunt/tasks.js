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
            'css/app.main.css': 'less/app.main.less'
        }
    }
};

const cssmin = {
    prodCss: {
        files: {
            'build/inspinia/css/lib.min.css': '<%= config.assets.lib.css %>',
            'build/css/app.min.css': '<%= config.assets.cssFullPath %>'
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
        'modules/**/*.js', 'modules/**/*.js.map'
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
            'build/js/lib.min.js': '<%= config.assets.lib.js %>',
            'build/js/app.min.js': '<%= config.assets.js %>'
        }
    }
};
const htmlmin = {
    production: {
        options: {
            removeComments: true,
            collapseWhitespace: true
        },
        files: [
            {
                expand: true,
                src: 'modules/**/*.html',
                rename: function (base, src) {
                    return 'build/' + src;
                }
            }
        ]
    }
};
const copy = {
    options: {
        rootpath: 'public'
    },
    prodImg: {
        files: [
            {
                expand: true,
                src: [
                    'modules/**/*.png',
                    'modules/**/*.jpg'
                ],
                rename: function (base, src) {
                    return 'build/' + src;
                }
            },
            {
                expand: true,
                src: [
                    'inspinia/**/*.png',
                    'inspinia/**/*.jpg'
                ],
                rename: function (base, src) {
                    return 'build/css/public/' + src.replace('inspinia/css/', '');
                }
            }
        ]
    },
    prodFonts: {
        files: [
            {
                src: 'fonts/*',
                expand: true,
                rename: function (base, src) {
                    return 'build/' + src;
                }
            },
            {
                src: 'inspinia/css/fonts/*',
                expand: true,
                rename: function (base, src) {
                    return 'build/' + src;
                }
            },
            {
                src: 'inspinia/font-awesome/fonts/*',
                expand: true,
                rename: function (base, src) {
                    return 'build/inspinia/fonts/' + src.split('/').pop();
                }
            }
        ]
    }
};
const uglify = {
    production: {
        files: {
            'build/js/app.min.js': 'build/js/app.min.js',
            'build/js/lib.min.js': 'build/js/lib.min.js'
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
    babel,
    ngAnnotate,
    env,
    karma,
    clean,
    htmlmin,
    copy,
    cssmin
};
