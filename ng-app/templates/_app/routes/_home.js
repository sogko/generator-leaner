/**
 * App route definitions for /home
 */
'use strict';

var app = module.exports = require('../app');
var env = require('../env');

app.config(['$stateProvider', function ($stateProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: env.templatePath('home.html'),
      controller: 'HomeController'
    });
}]);

console.log('Loaded <%= ngAppName %>/routes/home.js');
