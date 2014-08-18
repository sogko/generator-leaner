'use strict';

var gulp = require('gulp');
var lazypipe = require('lazypipe');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var config = require('../config');

var jshintTasks = lazypipe()
  .pipe(plumber)
  .pipe(jshint, '.jshintrc')
  .pipe(jshint.reporter, stylish);

gulp.task('jshint', function taskJSHint() {
  return gulp.src(config.jshint.glob)
    .pipe(jshintTasks());
});

gulp.task('jshint:watch', function taskJSHint() {
  watch({
    glob: config.jshint.glob,
    name: 'jshint'
  }, function (files) {
    return files
      .pipe(jshintTasks());
  });

});
