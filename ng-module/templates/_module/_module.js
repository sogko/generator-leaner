/**
 * <%= ngModuleFullName %> module definition
 */
define([
  'angular'
], function (ng) {
  'use strict';
  return ng.module('<%= ngModuleFullName %>', []);
});
console.log('Loaded <%= ngAppName %>/<%= ngModuleName %>/module.js');