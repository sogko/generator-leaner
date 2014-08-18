'use strict';

var gulp = require('gulp');

// load tasks from ./gulp/tasks/*.js
[
  'browser-sync',
  'nodemon',
  'csslint',
  'jshint',
  'build-client',
  'test'

].forEach(function (name) {
    require('./gulp/tasks/' + name);
  });

gulp.task('lint', ['jshint', 'csslint']);
gulp.task('lint:watch', ['jshint:watch', 'csslint:watch']);
gulp.task('build', ['build-client']);
gulp.task('build:production', ['build-client:production']);
gulp.task('tdd', ['lint:watch', 'test:watch']);
gulp.task('default', ['build', 'lint:watch', 'nodemon', 'browser-sync']);
