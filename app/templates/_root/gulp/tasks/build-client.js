'use strict';

var gulp = require('gulp');
var _ = require('lodash');
var path = require('path');
var async = require('async');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var transform = require('vinyl-transform');
var browserify = require('browserify');
var config = require('../config');

function asyncTaskBuildClient(_config, done) {

  if (typeof _config === 'function') {
    done = _config;
    _config = {};
  }

  var config = _.assign({
    baseDir: process.cwd(),
    destDir: path.join(process.cwd(), 'build'),
    env: 'development',
    skipBundles: []
  }, _config);

  if (!config.bundles) {
    return done();
  }

  async.each(config.bundles, function (opts, callback) {

    var called = false;

    // skip bundles
    if (_.indexOf(config.skipBundles, opts.name) > -1) {
      return callback();
    }

    var outputName = opts.name + '.js';

    function doBundle(filename) {
      // Note: filename allowed to be `null`
      var b = browserify(filename, {
        debug: (opts.env !== 'production')
      });
      if (opts.entries) {

      }

      opts.require.forEach(function (req) {
        b.require(req.location, { expose: req.expose });
      });

      opts.external.forEach(function (name) {
        b.external(name);
      });

      return b.bundle()
        .on('error', function (err) {
          gutil.log('build-client', err.message);
          if (!called) {
            called = true;
            callback();
          }
          // end this stream
          this.end();
        });
    }

    if (opts.entries && opts.entries.length > 0) {

      var browserified = transform(function (filename) {
        return doBundle(filename);
      });

      var stream = gulp.src(opts.entries)
        .pipe(plumber())
        .pipe(browserified);

      if (opts.concat) {
        stream = stream
          .pipe(concat(outputName));
      } else {
        stream = stream
          .pipe(rename(function (p) {
            p.dirname = path.join(opts.name, p.dirname);
          }));
      }
      stream
        .pipe(gulp.dest(config.destDir))
        .on('end', function () {
          if (!called) {
            called = true;
            callback();
          }
        });

    } else {
      doBundle(null)
        .pipe(plumber())
        .pipe(source(outputName))
        .pipe(buffer())
        .pipe(concat(outputName))
        .pipe(gulp.dest(config.destDir))
        .on('end', function () {
          if (!called) {
            called = true;
            callback();
          }
        });
    }
  }, function (err) {
    done(err);
  });
}

/**
 * Default alias to build-client
 */
gulp.task('build-client', ['build-client:development']);

/**
 * Default alias to build-client:watch
 */
gulp.task('build-client:watch', ['build-client:development:watch']);

/**
 * Watch and re-build client bundles on changes in development environment
 */
gulp.task('build-client:development:watch', function () {
  gulp.watch(config.buildClient.development.watch, ['build-client:development']);
});

/**
 * Build client bundles in development environment
 */
gulp.task('build-client:development', function (done) {
  asyncTaskBuildClient(config.buildClient.development, done);
});

/**
 * Build client bundles in test environment
 */
gulp.task('build-client:test', function (done) {
  asyncTaskBuildClient(config.buildClient.test, done);
});

/**
 * Build client bundles in production environment
 */
gulp.task('build-client:production', function (done) {
  asyncTaskBuildClient(config.buildClient.production, done);

});