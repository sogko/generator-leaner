'use strict';

var gulp = require('gulp');
var lazypipe = require('lazypipe');
var csslint = require('gulp-csslint');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var config = require('../config');

var csslintTasks = lazypipe()
  .pipe(plumber)
  .pipe(csslint, '.csslintrc')
  .pipe(csslint.reporter);

/**
 * Run .css files through csslint
 */
gulp.task('csslint', function taskCSSLint() {
  return gulp.src(config.csslint.glob)
    .pipe(csslintTasks());
});

/**
 * Watch and run .css files through csslint
 */
gulp.task('csslint:watch', function taskCSSLintWatch() {
  watch({
    name: 'csslint-changed',
    glob: config.csslint.glob
  }, function (files) {
    return files
      .pipe(csslintTasks());
  });
});