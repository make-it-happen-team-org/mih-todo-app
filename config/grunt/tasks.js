const watchFiles = require('./watch-files');

const less =             {
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
};

const jshint =           {
  all: {
    src: watchFiles.clientJS.concat(watchFiles.serverJS),
      options: {
      jshintrc: true
    }
  }
};

const uglify =           {
  production: {
    options: {
      mangle: false
    },
    files:   {
      'public/dist/js/main.min.js': 'public/dist/js/main.js'
    }
  }
};

const cssmin =           {
  combine: {
    files: {
      'public/dist/application.min.css': '<%= applicationCSSFiles %>'
    }
  }
};

const babel =            {
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
};

const nodemon =          {
  dev: {
    script:  'server-app-folder/server.js',
      options: {
      nodeArgs: ['--debug'],
        ext:      'js,html',
        watch:    watchFiles.serverViews.concat(watchFiles.serverJS)
    }
  }
};

const nodeInspector = {
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
};

const ngAnnotate =       {
  production: {
    files: {
      'public/dist/js/main.js': '<%= applicationJavaScriptFiles %>'
    }
  }
};

const concurrent =       {
  server:    ['nodemon', 'watch'],
    debug:     ['nodemon', 'watch', 'nodeInspector'],
    buildSrc:  ['build-less', 'build-es6'],
    minifySrc: ['cssmin', 'uglify'],
    options:   {
    logConcurrentOutput: true,
      limit:               10
  }
};

const env =              {
  development: {
    NODE_ENV: 'development'
  },
  production:  {
    NODE_ENV: 'production'
  },
  test:        {
    NODE_ENV: 'test'
  },
};

const karma =            {
  unit: {
    configFile: 'karma.conf.js'
  }
};

const clean =            {
  compiledJs: [
    'public/modules/**/*.js', 'public/modules/**/*.js.map',
    'server-app-folder/**/*.js', 'server-app-folder/**/*.js.map', '!server-app-folder/server.js'
  ]
};

const watch =            {
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
  nodemon,
  nodeInspector,
  ngAnnotate,
  concurrent,
  env,
  karma,
  clean
};
