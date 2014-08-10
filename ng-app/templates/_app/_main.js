/**
 * Main entry-point for modular ng-app <%= ngAppName %>
 *
 * By default, this file is loaded by /server/views/<%= ngAppName %>/home.hbs (http://localhost:3000/<%= ngAppName %>/)
 *
 * The module ID '<%= ngAppName %>' will refer to current Angular app path (/client/apps/<%= ngAppName %>/)
 * For eg: '<%= ngAppName %>/env' will refer to '/client/apps/<%= ngAppName %>/env.js'
 *
 * Refer to: http://requirejs.org/docs/api.html#config
 * TODO: move to require.config
 */
'use strict';

require.config({
  baseUrl: '/',
  path: {},
  packages: [],
  deps: []
});

define([
  'require',
  'angular',
  '<%= ngAppName %>/env',
  '<%= ngAppName %>/app',
  '<%= ngAppName %>/routes'
], function () {});

console.log('Loaded <%= ngAppName %>/main.js');