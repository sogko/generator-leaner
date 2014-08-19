'use strict';

var gulp = require('gulp');
var lazypipe = require('lazypipe');
var watch = require('gulp-watch');
var config = require('../config');

var copyAssetsTasks = lazypipe()
  .pipe(gulp.dest, config.copyAssets.dest);

gulp.task('copy-assets', function taskCopyAssets() {
  return gulp.src(config.copyAssets.glob)
    .pipe(copyAssetsTasks());
});

gulp.task('copy-assets:watch', function taskCopyAssetsWatch() {
  watch({
    glob: config.copyAssets.glob,
    name: 'copy-assets-changed'
  }, function (files) {
    return files
      .pipe(copyAssetsTasks());
  });

});
