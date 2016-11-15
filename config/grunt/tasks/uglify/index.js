module.exports =  {
  production: {
    options: {
      mangle: false
    },
    files: {
      'public/dist/application.min.js': 'public/dist/application.js'
    }
  }
};
