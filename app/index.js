'use strict';

var _ = require('lodash');
var path = require('path');
var async = require('async');

var LeanerGeneratorBase = require('../lib/generator-base');

var LeanerGenerator = LeanerGeneratorBase.extend({

  constructor: function () {
    LeanerGeneratorBase.apply(this, arguments);

    // init projectName
    this.argument('projectName', {
      desc: 'LEANER project name',
      defaults:  path.basename(process.cwd()),
      type: String,
      required: false
    });
    this.projectName = this.currentProjectName();
    console.log('this.projectName',this.projectName);

    // define options
    this.option('skip-install', {
      desc: 'Skip installing NPM and Bower dependencies',
      type: Boolean,
      default: false
    });

    this.option('skip-welcome-message', {
      desc: 'Skip welcome message',
      type: Boolean,
      default: false
    });

  },
  initializing: {
    welcome: function welcome() {
      if (!this.options['skip-welcome-message']) {
        this.logMessage('app.welcome');
      }
    }
  },
  prompting: {},
  configuring: {},
  default: {},
  writing: {
    generateProjectRoot: function generateProjectRoot() {
      this.logMessage('app.generateProjectRoot');
      this.copyTemplateDirectory('_root', this.paths.root);
    },
    generateServerComponents: function generateServerComponents() {
      this.logMessage('app.generateServerComponents');
      this.copyTemplateDirectory('server', this.paths.server.root);
    },
    generateClientComponents: function generateClientComponents() {
      this.logMessage('app.generateClientComponents');
      this.copyTemplateDirectory('client', this.paths.client.root);
    }
  },
  conflicts: {},
  install: {
    installDependencies: function generateProjectScaffold() {
      async.series([
        function installDependencies(next) {
          if (!this.options['skip-install']) {
            this.logMessage('app.installDependencies');
            this.installDependencies({
              callback: function() { next(); }
            });
          } else {
            this.logMessage('app.skippedInstallDependencies');
            next();
          }
        }.bind(this),
        function completed(next) {
          this.logMessage('app.completed');
          next();
        }.bind(this)
      ], function () {

      });
    }
  },
  end: {}
});

module.exports = LeanerGenerator;