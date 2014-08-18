var commonConfig = require('./karma.common.conf');
var _ = require('lodash');

module.exports = _.assign({}, commonConfig, {
  files: commonConfig.files.concat([
    //extra testing code
    'bower_components/angular-mocks/angular-mocks.js',

    //mocha stuff
    'tests/mocha.conf.js',

    //test files
    'tests/unit/**/*.spec.js'
  ])
});
