'use strict';

module.exports = {

  basePath: '.',
  frameworks: ['mocha', 'chai'],

  exclude: [],
  reporters: ['mocha'],
  port: 9876,
  colors: true,
  logLevel: 'INFO',
  autoWatch: true,
  browsers: ['PhantomJS'],
  singleRun: true,

  files : [

    // load 'common' bundle from client build because we skip it for test build
    // as configured in config.buildClient.test found in gulp/config.js
    'client/dist/js/common.js',

    // load app code from test build
    'tests/build/client/dist/js/**/*.js'
  ]
};