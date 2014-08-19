'use strict';

var gulp = require('gulp');

// load tasks from ./gulp/tasks/*.js
[
  'browser-sync',
  'nodemon',
  'csslint',
  'jshint',
  'sass',
  'copy-static-assets',
  'build-client',
  'build-css',
  'test'

].forEach(function (name) {
    require('./gulp/tasks/' + name);
  });

// Composite tasks

gulp.task('lint', ['jshint', 'csslint']);
gulp.task('lint:watch', ['jshint:watch', 'csslint:watch']);

gulp.task('build', ['lint', 'sass', 'copy-static-assets', 'build-client', 'build-css']);
gulp.task('build:watch', ['lint:watch', 'sass:watch', 'copy-static-assets:watch', 'build-client:watch', 'build-css:watch']);
gulp.task('build:production', ['build-client:production']);

gulp.task('tdd', ['lint:watch', 'test:watch']);
gulp.task('default', ['build', 'build:watch', 'nodemon', 'browser-sync']);

