/**
 * Mixin for LeanGenerator.prototype
 * 'this' is bounded to LeanGenerator context in MessagesMixins
 */

'use strict';

var chalk = require('chalk');
var Paths = require('./../../generator-paths');
var TerminalUtils = require('./../../terminal-utils');

module.exports = {
  errorProjectDoesNotExist: function () {
    return [
      '\n',
      '\n',
      TerminalUtils.banner('white', 'Failed to complete'),
      '\n',
      TerminalUtils.label('error', 'Fatal Error'),
      chalk.white('LEANER project does not exists in current directory or '), chalk.white.bold(Paths.dest.client.mainJs), ' is missing',
      '\n',
      TerminalUtils.list(null, '1.'), 'Run ', chalk.cyan('yo leaner'), ' to init current directory and generate LEANER project',
      '\n',
      '\n',
      TerminalUtils.rule(' [leaner:ng-app] END '),
      '\n'
    ].join('');
  },
  completed: function () {
    return [
      '\n',
      '\n',
      TerminalUtils.banner('success', 'Completed'),
      chalk.white('Your LEANER ng-app (Angular app) ' + chalk.bold(this.ngAppName) + ' has been created.'),
      '\n',
      '\n',
      chalk.white('The app is available at: '),
      '\n',
      chalk.bold('\t' + Paths(this).appUrl()),
      '\n',
      '\n',
      'Run ', chalk.cyan('npm start'), ' to serve the app',
      '\n',
      '\n',
      TerminalUtils.banner('info', 'Quick Start Tips'),
      TerminalUtils.list(null, '1.'), 'For starters, the following ng-modules (Angular modules) has been created for you:',
      '\n',
      TerminalUtils.list(null, '   -'), this.ngAppName + '.controllers',
      '\n',
      TerminalUtils.list(null, '   -'), this.ngAppName + '.directives',
      '\n',
      TerminalUtils.list(null, '   -'), this.ngAppName + '.filters',
      '\n',
      TerminalUtils.list(null, '   -'), this.ngAppName + '.services',
      '\n',
      '\n',
      TerminalUtils.list(null, '2.'), 'A sample controller ', chalk.bold(this.ngAppName + '.controllers.HomeController'), ' has been created for you to help you get started.',
      '\n',
      '\n',
      TerminalUtils.list(null, '3.'), 'Run ' + chalk.cyan('yo leaner:ng-module ' + this.ngAppName + '.<moduleName>') , ' to create a new ng-module (Angular module) for you app.',
      '\n',
      '\n',
      TerminalUtils.rule(' [leaner:ng-app] END '),
      '\n'
    ].join('');
  },
  generateClientApp: function () {
    return [
      '\n',
      TerminalUtils.label('cyan', 'info'),
      chalk.white('Generating ng-app (Angular app) scaffold in '),
      chalk.bold(Paths(this).dest.client.apps.app.root),
      '\n'
    ].join('');
  },
  createAppEndpointOnServer: function () {
    return [
      '\n',
      TerminalUtils.label('cyan', 'info'),
      chalk.white('Generating endpoint for ng-app on server at '),
      chalk.bold(Paths(this).appUrl()),
      '\n'
    ].join('');
  },
  wireClientMainJs: function () {
    return [
      '\n',
      TerminalUtils.label('cyan', 'info'),
      chalk.white('Wiring '),
      chalk.bold(Paths.dest.client.mainJs),
      chalk.white(' to define ng-app '),
      chalk.bold(this.ngAppName),
      chalk.white(' in \'config.packages\''),
      '\n'
    ].join('');

  },
  didAddNgAppToPackages: function () {
    return [
      TerminalUtils.label('green', 'updated'),
      chalk.white('Added '),
      chalk.bold(this.ngAppName),
      chalk.white(' to \'config.packages\''),
      '\n'
    ].join('');
  },
  ngAppAlreadyExistsInPackages: function () {
    return [
      TerminalUtils.label('yellow', 'no changes'),
      chalk.bold(this.ngAppName),
      chalk.white(' already included previously in \'config.packages\''),
      '\n'
    ].join('');
  },
  unableToDefineNgAppAutomatically: function () {
    return [
      TerminalUtils.label('yellow', 'no changes'),
      chalk.white('Unable to automatically add '),
      chalk.bold(this.ngAppName),
      chalk.white(' in \'config.packages\''),
      '\n',
      '\n',
      chalk.white('You may need to add it manually to enable the app.'),
      '\n',
      chalk.white('Example: '),
      '\n',
      '\n',
      TerminalUtils.code([
        '',
        'require.config({',
        '  ... ',
        '  packages: [ ',
        '    ... ',
        ['    { name: \'', this.ngAppName, '\', location: \'apps/', this.ngAppName, '\' }'].join(''),
        '  ],',
        '  ... ',
        '});',
        ''
      ]),
      '\n',
      '\n'
    ].join('');
  },
  createDefaultModules: function () {
    return [
      '\n',
      TerminalUtils.label('cyan', 'info'),
      chalk.white('Creating default modules for '),
      chalk.bold(this.ngAppName),
      '\n'
    ].join('');

  }
};