module.exports = {
  server: ['nodemon', 'watch'],
  debug: ['nodemon', 'watch', 'node-inspector'],
  buildSrc: ['build-less', 'build-es6'],
  minifySrc: ['cssmin', 'uglify'],
  options: {
    logConcurrentOutput: true,
    limit: 10
  }
};
