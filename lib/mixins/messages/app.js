/**
 * Mixin for LeanGenerator.prototype
 * 'this' is bounded to LeanGenerator context in MessagesMixins
 */

'use strict';

var chalk = require('chalk');
var yosay = require('yosay');
var TerminalUtils = require('./../../terminal-utils');

module.exports = {
  welcome: function () {
    return [
      yosay('Welcome! \nLet\'s get leaner, my friend!'),
      TerminalUtils.banner('white', 'What is a LEANER stack?'),
      'LEANER is a Lightweight & Leaner ExpressJS-AngularJS-NodeJS-RequireJS Stack',
      '\n'
    ].join('');
  },
  completed: function () {
    return [
      '\n',
      '\n',
      TerminalUtils.banner('success', 'Completed'),
      chalk.white('Your LEANER project ' + chalk.bold(this.projectName) + ' has been created.'),
      '\n',
      '\n',
      TerminalUtils.banner('info', 'Quick Start Tips'),
      TerminalUtils.list(null, '1.'), 'Run ', chalk.cyan('npm start'), ' to serve the app at ' ,
      chalk.bold(this.serverBaseHttpUrl()),
      '\n',
      '\n',
      TerminalUtils.list(null, '2.'), 'Run ' + chalk.cyan('yo leaner:ng-app <angularAppName>') , ' to create an ng-app (Angular app) at ',
      chalk.bold(this.appUrl('<angularAppName>')),
      '\n',
      '\n',
      TerminalUtils.rule(' END '),
      '\n'
    ].join('');
  },
  generateProjectRoot: function () {
    return [
      '\n',
      TerminalUtils.label('cyan', 'info'),
      chalk.white('Generating project root scaffold in '),
      chalk.bold(this.resolveDestination(this.paths.root)),
      '\n'
    ].join('');
  },
  generateServerComponents: function () {
    return [
      '\n',
      TerminalUtils.label('cyan', 'info'),
      chalk.white('Generating ExpressJS server scaffold in '),
      chalk.bold(this.resolveDestination(this.paths.server.root)),
      '\n'
    ].join('');
  },
  generateClientComponents: function () {
    return [
      '\n',
      TerminalUtils.label('cyan', 'info'),
      chalk.white('Generating AngularJS client scaffold in '),
      chalk.bold(this.resolveDestination(this.paths.client.root)),
      '\n'
    ].join('');
  },
  installDependencies: function () {
    return [
      '\n',
      TerminalUtils.label('cyan', 'info'),
      chalk.white('Installing dependencies ('),
      chalk.yellow.bold('bower install'),
      chalk.white(' & '),
      chalk.yellow.bold('npm install'),
      chalk.white(')'),
      '\n'
    ].join('');
  },
  skippedInstallDependencies: function () {
    return [
      '\n',
      TerminalUtils.label('cyan', '--skip-install'),
      chalk.white('Skipped running '),
      chalk.yellow.bold('bower install'),
      chalk.white(' & '),
      chalk.yellow.bold('npm install'),
      '\n',
      chalk.white('You may need to run it yourself to ensure all required dependencies are installed'),
      '\n'
    ].join('');
  }
};