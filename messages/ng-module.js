/**
 * Mixin for LeanGenerator.prototype
 * 'this' is bounded to LeanGenerator context in MessagesMixins
 */

'use strict';

var chalk = require('chalk');
var path = require('path');
var TerminalUtils = require('./../lib/terminal-utils');

module.exports = {
  errorExpectedNameArgumentWrongFormat: function () {
    return [
      '\n',
      '\n',
      TerminalUtils.banner('white', 'Failed to complete'),
      '\n',
      TerminalUtils.label('error', 'Fatal Error'),
      chalk.white('Expected name to be in '),
      chalk.bold('\'<ngAppName>.<ngAppModuleName>\''),
      chalk.white(' format.'),
      '\n',
      chalk.white('For example: '),
      chalk.cyan('yo leaner:ng-module myApp.controllers'),
      '\n',
      '\n',
      TerminalUtils.rule(' [leaner:ng-module] END '),
      '\n'
    ].join('');
  },
  errorNgAppDoesNotExist: function () {
    return [
      '\n',
      '\n',
      TerminalUtils.banner('white', 'Failed to complete'),
      '\n',
      TerminalUtils.label('error', 'Fatal Error'),
      chalk.bold(this.ngAppName),
      chalk.white(' app does not exists in current directory or '), chalk.white.bold( this.resolvesNgAppRootPath()), ' is missing',
      '\n',
      TerminalUtils.list(null, '1.'), 'Run ', chalk.cyan('yo leaner:ng-app ' + this.ngAppName), ' to create an ng-app (Angular app)',
      '\n',
      '\n',
      TerminalUtils.rule(' [leaner:ng-module] END '),
      '\n'
    ].join('');
  },
  completed: function () {
    return [
      '\n',
      '\n',
      TerminalUtils.banner('success', 'Completed'),
      '\n',
      chalk.white('Your LEANER ng-module (Angular module) ' + chalk.bold(this.ngModuleFullName) + ' has been created.'),
      '\n',
      '\n',
      chalk.white('The module files were written in: '),
      chalk.bold(this.resolvesNgModuleRootPath() + '/'),
      '\n',
      '\n',
      TerminalUtils.rule(' [leaner:ng-module] END '),
      '\n'
    ].join('');
  },
  generateAppModuleScaffold: function () {
    return [
      '\n',
      TerminalUtils.label('cyan', 'info'),
      chalk.white('Generating ng-module scaffold in '),
      chalk.bold(this.resolvesNgModuleRootPath() + '/'),
      '\n'
    ].join('');
  },
  wireModuleToAppDefinitions: function () {
    return [
      '\n',
      TerminalUtils.label('cyan', 'info'),
      chalk.white('Wiring '),
      chalk.bold(this.resolvesNgAppRootPath('app.js')),
      chalk.white(' to include ng-module '),
      chalk.bold(this.ngModuleFullName),
      chalk.white(' as a dependency'),
      '\n'
    ].join('');

  },
  didAddNgModuleToRequiredArray: function () {
    return [
      TerminalUtils.label('green', 'updated'),
      chalk.white('Required '),
      chalk.bold(this.ngModuleFullName),
      chalk.white(' module loader file'),
      '\n'
    ].join('');
  },
  didAddNgModuleToModuleArray: function () {
    return [
      TerminalUtils.label('green', 'updated'),
      chalk.white('Added '),
      chalk.bold(this.ngModuleFullName),
      chalk.white(' to ng.module(\'' + this.ngAppName + '\')'),
      '\n'
    ].join('');
  },
  ngModuleAlreadyExistsInPackages: function () {
    return [
      TerminalUtils.label('yellow', 'no changes'),
      chalk.white('Module '),
      chalk.bold(this.ngModuleFullName),
      chalk.white(' already configured previously'),
      '\n'
    ].join('');
  },
  unableToDefineNgModuleAutomatically: function () {
    return [
      TerminalUtils.label('yellow', 'skip'),
      chalk.white('Unable to automatically add '),
      chalk.bold(this.ngModuleFullName),
      chalk.white(' in \'' + this.resolvesNgAppRootPath('app.js') + '\''),
      '\n',
      '\n',
      chalk.white('You may need to add it manually to enable the app.'),
      '\n',
      chalk.white('Example: '),
      '\n',
      '\n',
      TerminalUtils.code([
        '',
        'define.([',
        '  \'require\',',
        '  \'angular\',',
        '  ... ',
        '  \'' + path.join(this.ngAppName, this.ngModuleName, 'main') + '\'' + '    // 1. require module loader file',
        '], function (require, ng) {',
        '  return ng.module(\'LAVA\', [',
        '    ... ',
        '    \'' + this.ngModuleFullName + '\'    // 2. add module to ng-app',
        '  ]);',
        '});',
        ''
      ]),
      '\n',
      '\n'
    ].join('');
  },
};