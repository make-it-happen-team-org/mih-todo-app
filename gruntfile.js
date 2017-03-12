const initConfig    = require('./config/grunt/tasks');
const registerTasks = require('./config/grunt/register-tasks');
const loadTasks     = require('load-grunt-tasks');

module.exports = (grunt) => {
  loadTasks(grunt);
  grunt.option('force', true);
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.initConfig(initConfig);
  registerTasks(grunt);
};
