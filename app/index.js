'use strict';
var util = require('util');
var path = require('path');
var async = require('async');
var yeoman = require('yeoman-generator');


var MessagesMixin = require('../lib/mixins/messages');
var Utils = require('../lib/generator-utils');
var Paths = require('../lib/generator-paths');

var LeanerGenerator = module.exports = function LeanerGenerator(args, options) {
  yeoman.generators.Base.apply(this, arguments);

  // load generator package.json
  this.pkg = require('../package.json');

  this.argument('projectName', {
    desc: 'LEANER project name',
    defaults:  path.basename(process.cwd()),
    type: String,
    required: false
  });
  this.projectName = Paths(this).currentProjectName();

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

  this.on('end', function () {

  });
};

util.inherits(LeanerGenerator, yeoman.generators.Base);
util._extend(LeanerGenerator.prototype, MessagesMixin);

LeanerGenerator.prototype.welcome = function welcome() {
  if (!this.options['skip-welcome-message']) {
    this.messages('app.welcome');
  }
};

LeanerGenerator.prototype.generateProjectScaffold = function generateProjectScaffold() {
  async.series([
    function generateProjectRoot(next) {
      this.messages('app.generateProjectRoot');
      Utils(this).copyTemplateDirectory('_root', Paths.dest.root);
      next();
    }.bind(this),
    function generateServerComponents(next) {
      this.messages('app.generateServerComponents');
      Utils(this).copyTemplateDirectory('server', Paths.dest.server.root);
      next();
    }.bind(this),
    function generateClientComponents(next) {
      this.messages('app.generateClientComponents');
      Utils(this).copyTemplateDirectory('client', Paths.dest.client.root);
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
};

