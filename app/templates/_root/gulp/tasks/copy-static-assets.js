'use strict';

var gulp = require('gulp');
var lazypipe = require('lazypipe');
var watch = require('gulp-watch');
var config = require('../config');

var copyAssetsTasks = lazypipe()
  .pipe(gulp.dest, config.copyStaticAssets.dest);

/**
 * Copy asset files (html, images or any files in client/src/static folder) to client/dist/static
 * This allows us to server static files separately from runtime server code
 */
gulp.task('copy-static-assets', function taskCopyAssets() {
  return gulp.src(config.copyStaticAssets.glob)
    .pipe(copyAssetsTasks());
});

/**
 * Watch and copy asset files tot static folder
 */
gulp.task('copy-static-assets:watch', function taskCopyAssetsWatch() {
  watch({
    glob: config.copyStaticAssets.glob,
    name: 'copy-static-assets-changed'
  }, function (files) {
    return files
      .pipe(copyAssetsTasks());
  });
});
