/**
 * Angular app (<%= ngAppName %>) route definitions loader
 *
 * Require additional app route definitions here
 */
define([
  'require',
  '<%= ngAppName %>/app',
  '<%= ngAppName %>/env',
  '<%= ngAppName %>/routes/home'
], function (require, app) {
  'use strict';

  // define default app route
  app.config(function ($urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
  });

  return app;
});