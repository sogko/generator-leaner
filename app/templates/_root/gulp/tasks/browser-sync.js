'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var config = require('../config');

gulp.task('browser-sync', function taskBrowserSync() {

  // delay initializing browserSync to avoid race condition
  // between nodemon completing and browserSync starting
  setTimeout(function initBrowserSync() {
    browserSync.init(null, {
      files: config.browserSync.files,
      proxy: config.browserSync.proxy,
      browser: config.browserSync.browser,
      port: config.browserSync.port
    });
  }, config.browserSync.reloadDelay);

});