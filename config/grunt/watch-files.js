module.exports = {
  serverViews:   ['server-app-folder/views/**/*.*'],
  mochaTestsES6: ['server-app-folder/tests/**/*.es6'],
  mochaTests:    ['server-app-folder/tests/**/*.js'],
  clientViews:   ['public/modules/**/views/**/*.html'],
  clientCSS:     ['public/assets/**/*.css'],
  allES6:        ['public/**/*.es6', 'server-app-folder/**/*.es6'],
  clientLESS:    ['public/**/*.less', '!public/lib/**/*.less'],
  serverJS:      [
    'gruntfile.js',
    'server-app-folder/server.js',
    'config/**/*.js',
    'server-app-folder/**/*.js',
    '!server-app-folder/tests/'
  ],
  clientJS:      [
    'public/js/**/*.js',
    'public/**/*.es6',
    '!public/**/*.compiled.js'
  ]
};
