'use strict';

var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var config = require('../config');

/**
 * Run server app (ExpressJS) through nodemon so that we can restart the server automatically upon any changes core server files
 */
gulp.task('nodemon', function taskNodemon(cb) {
  var called = false;
  return nodemon({
    script: config.nodemon.script,
    watch: config.nodemon.watch
  })
    .on('start', function onStart() {
      if (!called) { cb(); }  // ensure start only got called once
      called = true;
    })
    .on('restart', function onRestart() {
      // reload connected browsers after a delay
      setTimeout(function reload() {
        browserSync.reload({ stream: false });
      }, config.browserSync.reloadDelay);
    });
});
