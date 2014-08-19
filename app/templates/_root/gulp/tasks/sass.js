'use strict';

var gulp = require('gulp');
var lazypipe = require('lazypipe');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var config = require('../config');

var sassTasks = lazypipe()
  .pipe(plumber)
  .pipe(sass)
  .pipe(gulp.dest, config.sass.dest);

/**
 * Compiles *.scss (sass) files into .css
 */
gulp.task('sass', function sassTask() {
  return gulp.src(config.sass.glob)
    .pipe(sassTasks());
});

/**
 * Watch and compile *.scss (sass) files into .css
 */
gulp.task('sass:watch', function sassTaskWatch() {
  watch({
    name: 'sass-changed',
    glob: config.sass.glob
  }, function (files) {
    return files
      .pipe(sassTasks());
  });
});