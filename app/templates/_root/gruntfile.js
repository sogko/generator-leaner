'use strict';

module.exports = function(grunt) {

  var LIVE_RELOAD_PORT = 35744;
  var watchFiles = {
    serverViews: ['server/views/**/*.*'],
    serverJS: ['gruntfile.js', 'server/**/*.js'],
    clientViews: ['client/apps/**/partials/**/*.html'],
    clientJS: ['client/apps/**/*.js', 'client/assets/js/lib/**/*.js'],
    clientCSS: ['client/assets/css/**/*.css'],
    mochaTests: ['/tests/mocha/**/*.js']
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      serverViews: {
        files: watchFiles.serverViews,
        options: {
          livereload: LIVE_RELOAD_PORT
        }
      },
      serverJS: {
        files: watchFiles.serverJS,
        tasks: ['jshint'],
        options: {
          livereload: LIVE_RELOAD_PORT
        }
      },
      clientViews: {
        files: watchFiles.clientViews,
        options: {
          livereload: LIVE_RELOAD_PORT
        }
      },
      clientJS: {
        files: watchFiles.clientJS,
        tasks: ['jshint'],
        options: {
          livereload: LIVE_RELOAD_PORT
        }
      },
      clientCSS: {
        files: watchFiles.clientCSS,
        tasks: ['csslint'],
        options: {
          livereload: LIVE_RELOAD_PORT
        }
      }
    },
    jshint: {
      all: {
        src: watchFiles.clientJS.concat(watchFiles.serverJS),
        options: {
          jshintrc: true
        }
      }
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      all: {
        src: watchFiles.clientCSS
      }
    },
    nodemon: {
      dev: {
        script: 'server/app.js',
        options: {
          ext: 'js,html',
          watch: watchFiles.serverViews.concat(watchFiles.serverJS)
        }
      }
    },
    concurrent: {
      default: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },
    requirejs: {
      js: {
        options: {
          uglify2: {
            mangle: false
          },
          baseUrl: 'client',
          mainConfigFile: 'client/main.js',
          name: 'main',
          out: 'client/build/main.js',
          optimize: 'uglify2'
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    }
  });

  // load all grunt tasks matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  // continue even with errors (failed lint for example)
  grunt.option('force', true);

  grunt.registerTask('default', ['lint', 'concurrent:default']);

  // Lint task(s).
  grunt.registerTask('lint', ['jshint', 'csslint']);

};