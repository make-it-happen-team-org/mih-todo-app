const initConfig = require('./config/grunt/tasks');
const registerTasks = require('./config/grunt/register-tasks');

module.exports = (grunt) => {
  require('load-grunt-tasks')(grunt);

  grunt.option('force', true);
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.initConfig(initConfig);

  registerTasks(grunt);
};
