'use strict';
var gulp = require('gulp');
var _ = require('lodash');
var karma = require('karma').server;
var config = require('../config');

[
  'build-client'
].forEach(function (name) {
    require('./' + name);
  });

gulp.task('test:unit', ['build-client:test'], function (done) {
  karma.start(_.assign({}, config.karma.unit, { singleRun: true }), done);
});
gulp.task('test:midway', function (done) {
  karma.start(_.assign({}, config.karma.midway, { singleRun: true }), done);
});
gulp.task('test:e2e', function (done) {
  karma.start(_.assign({}, config.karma.e2e, { singleRun: true }), done);
});
