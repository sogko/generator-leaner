/**
 * Angular app modules definitions
 *
 * Require additional app modules here
 *
 */

'use strict';

// require ng-app module dependencies
require('angular');
require('angular-ui-router');
require('./controllers');
require('./filters');
require('./directives');
require('./services');

// define ng-app module
var app = module.exports = angular.module('<%= ngAppName %>', [
  'ui.router',
  '<%= ngAppName %>.controllers',
  '<%= ngAppName %>.filters',
  '<%= ngAppName %>.directives',
  '<%= ngAppName %>.services'
]);

// load defined routes after `app` has been defined
require('./routes/home');

// define default `app` route
app.config(function ($urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
});

console.log('Loaded <%= ngAppName %>/app.js');