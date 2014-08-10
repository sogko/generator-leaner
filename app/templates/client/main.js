/**
 * Main loader for client side scripts and applications
 *
 * By default, this file is loaded from /server/views/layouts/main.hbs
 */
'use strict';

require.config({
  baseUrl: '/',

  paths: {
    'angular': 'assets/js/vendor/angular/angular',
    'ui.router': 'assets/js/vendor/angular-ui-router/release/angular-ui-router',
    'domReady': 'assets/js/vendor/requirejs-domready/domReady',
    'jquery': 'assets/js/vendor/jquery/dist/jquery',
    'bootstrap': 'assets/js/vendor/jquery/dist/jquery'
  },

  packages: [
    // define additional ng-app packages here
  ],

  shim: {
    'angular': {
      'deps': ['jquery'],
      'exports': 'angular'
    },
    'ui.router' : ['angular']
  },

  deps: [
    // include ng-app packages as dependencies here
  ]

});
console.log('Loaded main.js');