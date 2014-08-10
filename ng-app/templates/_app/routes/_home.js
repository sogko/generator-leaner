/**
 * App route definitions for /home
 */
'use strict';

define([
  '<%= ngAppName %>/app',
  '<%= ngAppName %>/env'
], function (app, env) {

  app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: env.templatePath('home.html'),
        controller: 'HomeController'
      });
  }]);

  return app;
});