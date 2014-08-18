var commonConfig = require('./karma.common.conf');
var _ = require('lodash');

module.exports = _.assign({}, commonConfig, {
  files: [
    //extra testing code
    'node_modules/ng-midway-tester/src/ngMidwayTester.js',

    //mocha stuff
    'tests/mocha.conf.js',

    //test files
    'tests/midway/appSpec.js',
    'tests/midway/controllers/controllersSpec.js',
    'tests/midway/filters/filtersSpec.js',
    'tests/midway/directives/directivesSpec.js',
    'tests/midway/requestsSpec.js',
    'tests/midway/routesSpec.js',
    'tests/midway/**/*.js'
  ],
  proxies: {
    '/': 'http://localhost:9999/'
  }

});
