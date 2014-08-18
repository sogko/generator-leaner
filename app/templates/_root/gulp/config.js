'use strict';

var _ = require('lodash');
var configUtils = require('./utils/config-utils');

var files = {
  root: {
    js: [
      'gulpfile.js',
      'karma.common.conf.js',
      'karma.conf.js'
    ]
  },
  server: {
    views: [
      'server/views/**/*.*'
    ],
    js: [
      'server/**/*.js'
    ]
  },
  client: {
    dist: ['client/dist/js/app.js'],
    entryPoint: 'client/app.js',
    views: [
      'client/apps/**/partials/**/*.html'
    ],
    js: [
      'client/*.js',
      'client/apps/**/*.js',
      'client/assets/js/lib/**/*.js',
      '!client/assets/js/vendor/**/*.js',
      '!client/dist/js/*.js'
    ],
    vendor: ['client/assets/js/vendor/**/*.js'],
    css: [
      'client/assets/css/**/*.css'
    ]
  },
  tests: {
    js: [
      'tests/**/*.js',
      '!tests/build/**/*.js'
    ]
  },
  gulp: {
    js: ['gulp/**/*.js']
  },
  jsHintFiles: function jsHintFiles() {
    return this.server.js
      .concat(this.client.js)
      .concat(this.tests.js)
      .concat(this.gulp.js)
      .concat(this.root.js);
  },
  cssLintFiles: function cssLintFiles() {
    return this.client.css;
  },
  nodemonWatchFiles: function browserSyncFiles() {
    return this.server.js
      .concat(this.client.js);
  },
  browserSyncFiles: function browserSyncFiles() {
    // preferably file that can be injected or does not require a build
    return this.client.css
      .concat(this.client.views)
      .concat(this.server.views);
  }
};

module.exports = {
  files: files,
  jshint: {
    glob: files.jsHintFiles()
  },
  csslint: {
    glob: files.cssLintFiles()
  },
  browserSync: {
    files: files.browserSyncFiles(),
    proxy: 'http://localhost:3000',
    browser: ['google chrome'],
    port: 4000,
    reloadDelay: 500
  },
  nodemon: {
    script: 'server/app.js',
    watch: files.nodemonWatchFiles()
  },
  buildClient: {
    development: _.assign({}, configUtils.parseClientBuildConfig(require('../client/config').build), {
      env: 'development'
    }),
    production: _.assign({}, configUtils.parseClientBuildConfig(require('../client/config').build), {
      env: 'production'
    }),
    test: _.assign({}, configUtils.parseClientBuildConfig(require('../client/config').build), {
      env: 'test',
      destDir: 'tests/build/client/dist/js',
      skipBundles: ['common']
    })
  },
  karma: {
    unit: require('../tests/karma.unit.conf'),
    midway: require('../tests/karma.midway.conf'),
    e2e: require('../tests/karma.e2e.conf')
  }
};