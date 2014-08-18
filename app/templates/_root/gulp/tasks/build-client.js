'use strict';

var gulp = require('gulp');
var _ = require('lodash');
var path = require('path');
var async = require('async');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
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

    // skip bundles
    if (_.indexOf(config.skipBundles, opts.name) > -1) {
      return callback();
    }

    var outputName = opts.name + '.js';

    function doBundle(filename) {
      // Note: filename allowed to be `null`
      var b = browserify(filename, {
        debug: (opts.env === 'production')
      });
      if (opts.entries) {

      }
      opts.require.forEach(function (req) {
        b.require(req.location, { expose: req.expose });
      });

      opts.external.forEach(function (name) {
        b.external(name);
      });

      return b.bundle();
    }

    if (opts.entries) {

      var browserified = transform(function (filename) {
        return doBundle(filename);
      });

      var stream = gulp.src(opts.entries)
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
          callback();
        });

    } else {
      doBundle(null)
        .pipe(source(outputName))
        .pipe(buffer())
        .pipe(concat(outputName))
        .pipe(gulp.dest(config.destDir))
        .on('end', function () {
          callback();
        });
    }
  }, function (err) {
    done(err);
  });
}

gulp.task('build-client', ['build-client:development']);

gulp.task('build-client:development', function (done) {
  asyncTaskBuildClient(config.buildClient.development, done);
});

gulp.task('build-client:test', function (done) {
  asyncTaskBuildClient(config.buildClient.test, done);
});

gulp.task('build-client:production', function (done) {
  asyncTaskBuildClient(config.buildClient.production, done);

});