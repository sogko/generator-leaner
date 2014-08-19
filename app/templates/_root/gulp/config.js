'use strict';

var _ = require('lodash');

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
    views: [
      'client/apps/**/partials/**/*.html'
    ],
    js: [
      'client/*.js',
      'client/src/apps/**/*.js',
      'client/src/assets/js/lib/**/*.js',
      '!client/dist/js/*.js'
    ],
    vendor: ['client/assets/js/vendor/**/*.js'],
    css: [
      'client/dist/**/*.css'
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
    return ['client/dist/all.css']
      .concat(this.client.views)
      .concat(this.server.views);
  }
};

var baseBuildClientConfig = require('./utils/config-utils').parseClientBuildConfig(require('../client/config').build);

module.exports = {
  files: files,
  sass: {
    glob: [
      'client/src/**/*.scss'
    ],
    // temporary intermediate folder for compiled files ready for build
    dest: 'client/src/compiled/sass'
  },
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
    development: _.assign({}, baseBuildClientConfig, {
      env: 'development',
      watch: files.jsHintFiles()
    }),
    production: _.assign({}, baseBuildClientConfig, {
      env: 'production'
    }),
    test: _.assign({}, baseBuildClientConfig, {
      env: 'test',
      destDir: 'tests/build/client/dist/js',
      skipBundles: ['common']
    })
  },
  buildCSS: {
    glob: [
      'client/src/**/*.css',
      'client/src/compiled/**/*.css'
    ],
    filename: 'all.css',
    dest: 'client/dist'
  },
  karma: {
    unit: require('../tests/karma.unit.conf'),
    midway: require('../tests/karma.midway.conf'),
    e2e: require('../tests/karma.e2e.conf')
  },
  copyAssets: {
    glob: [
      'client/src/assets/**/*',
      'client/src/**/*.html',
      '!client/src/**/*.md',
      '!client/src/**/*.scss',
      '!client/src/**/*.css' // would be handled by build-css
    ],
    dest: './client/dist'
  }
};