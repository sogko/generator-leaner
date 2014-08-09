'use strict';
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    requirejs: {
      js: {
        options: {
          uglify2: {
            mangle: false
          },
          baseUrl: "client",
          mainConfigFile: "client/main.js",
          name: 'main',
          out: "client/build/main.js",
          optimize: 'uglify2'
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  // Default task(s).
  grunt.registerTask('default', ['requirejs']);

};