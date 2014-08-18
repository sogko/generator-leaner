var commonConfig = require('./karma.common.conf');
var _ = require('lodash');

module.exports = _.assign({}, commonConfig, {
  files: [
    'tests/e2e/**/*.js'
  ],
  proxies: {
    '/': 'http://localhost:9999/'
  },
  urlRoot: '/__karma__/',
  frameworks: ['ng-scenario']
});
