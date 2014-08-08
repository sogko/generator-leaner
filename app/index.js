'use strict';
var util = require('util');
var _ = require('lodash');
var path = require('path');
var async = require('async');
var yeoman = require('yeoman-generator');


var MessagesMixins = require('../lib/mixins/messages');
var ActionsMixins = require('../lib/mixins/actions');
var PathsMixins = require('../lib/mixins/paths');

var LeanerGeneratorBase = yeoman.generators.Base.extend({});

// mix-ins
_.extend(LeanerGeneratorBase.prototype, PathsMixins);
_.extend(LeanerGeneratorBase.prototype, ActionsMixins);
_.extend(LeanerGeneratorBase.prototype, MessagesMixins);

var LeanerGenerator = module.exports = LeanerGeneratorBase.extend({

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
        this.messages('app.welcome');
      }
    }
  },
  prompting: {},
  configuring: {},
  default: {},
  writing: {
    generateProjectScaffold: function generateProjectScaffold() {
      async.series([
        function generateProjectRoot(next) {
          this.messages('app.generateProjectRoot');
          this.copyTemplateDirectory('_root', this.paths.root);
          next();
        }.bind(this),
        function generateServerComponents(next) {
          this.messages('app.generateServerComponents');
          this.copyTemplateDirectory('server', this.paths.server.root);
          next();
        }.bind(this),
        function generateClientComponents(next) {
          this.messages('app.generateClientComponents');
          this.copyTemplateDirectory('client', this.paths.client.root);
          next();
        }.bind(this),
        function installDependencies(next) {
          if (!this.options['skip-install']) {
            this.messages('app.installDependencies');
            this.installDependencies({
              callback: function() { next(); }
            });
          } else {
            this.messages('app.skippedInstallDependencies');
            next();
          }
        }.bind(this),
        function completed(next) {
          this.messages('app.completed');
          next();
        }.bind(this)
      ], function () {

      });
    }
  },
  conflicts: {},
  install: {},
  end: {}
});