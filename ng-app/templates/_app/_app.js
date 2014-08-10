/**
 * Angular app modules definitions
 *
 * Require additional app modules here
 *
 */

define([
  'require',
  'angular',
  'ui.router'
], function (require, ng) {
  'use strict';

  return ng.module('<%= ngAppName %>', [
    'ui.router'
  ]);
});