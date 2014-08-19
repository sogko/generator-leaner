'use strict';

var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var CleanCSS = require('clean-css');
var map = require('vinyl-map');
var config = require('../config');

/**
 * Build minified + concatenated css using `clean-css`
 */
gulp.task('build-css', function buildCSSTask() {
  var minify = map(function (code) {
    code = code.toString();
    return new CleanCSS({
      keepSpecialComments: 0,
      keepBreaks: false
    }).minify(code);
  });

  return gulp.src(config.buildCSS.glob)
    .pipe(concat(config.buildCSS.filename))
    .pipe(minify)
    .pipe(gulp.dest(config.buildCSS.dest));
});

/**
 * Watch and re-build minified+concatenated css if there is any changes in css files
 */
gulp.task('build-css:watch', function buildCSSTaskWatch() {

  gulp.watch(config.buildCSS.glob, ['build-css'])
    .on('change', function (event) {
      gutil.log(gutil.colors.cyan('build-css-changed'), 'saw', gutil.colors.magenta(path.basename(event.path)), 'was', event.type);
    });
});