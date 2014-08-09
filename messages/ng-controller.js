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
      chalk.bold('\'<ngAppName>.controllers.<ngControllerName>\''),
      chalk.white(' format.'),
      '\n',
      chalk.white('For example: '),
      chalk.cyan('yo leaner:ng-controller myApp.controllers.HomeController'),
      '\n',
      '\n',
      TerminalUtils.rule(' [leaner:ng-controller] END '),
      '\n'
    ].join('');
  },
  errorNgControllerDoesNotExist: function () {
    return [
      '\n',
      '\n',
      TerminalUtils.banner('white', 'Failed to complete'),
      '\n',
      TerminalUtils.label('error', 'Fatal Error'),
      chalk.bold(this.ngModuleFullName),
      chalk.white(' module does not exists in current directory or '), chalk.white.bold( this.resolvesNgModuleRootPath()), ' is missing',
      '\n',
      TerminalUtils.list(null, '1.'), 'Run ', chalk.cyan('yo leaner:ng-module ' + this.ngModuleFullName), ' to create an ng-module (Angular module)',
      '\n',
      '\n',
      TerminalUtils.rule(' [leaner:ng-controller] END '),
      '\n'
    ].join('');
  },
  completed: function () {
    return [
      '\n',
      '\n',
      TerminalUtils.banner('success', 'Completed'),
      '\n',
      chalk.white('Your LEANER ng-controller (Angular module controller) ' + chalk.bold(this.ngControllerFullName) + ' has been created.'),
      '\n',
      '\n',
      chalk.white('The following controller were written: '),
      chalk.bold(this.ngControllerFilePath),
      '\n',
      '\n',
      TerminalUtils.rule(' [leaner:ng-controller] END '),
      '\n'
    ].join('');
  },
  generateControllerScaffold: function () {
    return [
      '\n',
      TerminalUtils.label('cyan', 'info'),
      chalk.white('Generating ng-controller scaffold in '),
      chalk.bold(this.ngControllerFilePath),
      '\n'
    ].join('');
  },
  wireControllerToLoaderDefinitions: function () {
    return [
      '\n',
      TerminalUtils.label('cyan', 'info'),
      chalk.white('Wiring '),
      chalk.bold(this.resolvesNgModuleRootPath('main.js')),
      chalk.white(' to include ng-controller '),
      chalk.bold(this.ngControllerFullName),
      chalk.white(' as a dependency'),
      '\n'
    ].join('');

  },
  didAddNgControllerToRequiredArray: function () {
    return [
      TerminalUtils.label('green', 'updated'),
      chalk.white('Required '),
      chalk.bold(this.ngControllerComponentFile),
      chalk.white(' module'),
      '\n'
    ].join('');
  },
  ngControllerAlreadyExistsInPackages: function () {
    return [
      TerminalUtils.label('yellow', 'no changes'),
      chalk.white('Module '),
      chalk.bold(this.ngControllerFullName),
      chalk.white(' already configured previously'),
      '\n'
    ].join('');
  },
  unableToDefineNgControllerAutomatically: function () {
    return [
      TerminalUtils.label('yellow', 'skip'),
      chalk.white('Unable to automatically add '),
      chalk.bold(this.ngControllerFullName),
      chalk.white(' in \'' + this.resolvesNgModuleRootPath('main.js') + '\''),
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
        '  \'./module\',',
        '  ... ',
        '  \'' + this.ngControllerComponentFile + '    // require controller component',
        '], function () {',
        '  ... ',
        '});',
        ''
      ]),
      '\n',
      '\n'
    ].join('');
  },
};