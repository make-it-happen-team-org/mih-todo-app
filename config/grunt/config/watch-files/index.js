module.exports = {
  serverViews: ['server/views/**/*.*'],
  serverJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'server/**/*.js', '!server/tests/'],
  clientViews: ['public/modules/**/views/**/*.html'],
  clientJS: ['public/js/**/*.js', 'public/**/*.es6', '!public/**/*.compiled.js'],
  allES6: ['public/**/*.es6', 'server/**/*.es6'],
  clientCSS: ['public/assets/**/*.css'],
  clientLESS: ['public/less/*main.less'],
  mochaTestsES6: ['server/tests/**/*.es6'],
  mochaTests: ['server/tests/**/*.js']
};
