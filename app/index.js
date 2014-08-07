'use strict';
var util = require('util');
var async = require('async');
var yeoman = require('yeoman-generator');

var Messages = require('../lib/generator-messages');
var Utils = require('../lib/generator-utils');
var Paths = require('../lib/generator-paths');

var LeanerGenerator = module.exports = function LeanerGenerator(args, options) {
  yeoman.generators.Base.apply(this, arguments);

  // init LEANER project name
  this.projectName = this.projectName || path.basename(process.cwd());
  this.projectName = this._.camelize(this._.slugify(this._.humanize(this.projectName)));
  this.appname = this.projectName; // alias it to 'appname'

  // load generator package.json
  this.pkg = require('../package.json');

  // define arguments
  this.argument('projectName', {
    desc: 'LEANER project name',
    defaults:  path.basename(process.cwd()),
    type: String,
    required: false
  });

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

  // install dependencies after completed generating project scaffold
  this.on('end', function () {
    var endMessage = function endMessage() {
      this.log(Messages(this).app.completed());
    }.bind(this);
    if (!this.options['skip-install']) {
      this.installDependencies({
        callback: endMessage
      });
    } else {
      endMessage();
    }
  });
};

util.inherits(LeanerGenerator, yeoman.generators.Base);

LeanerGenerator.prototype.welcome = function welcome() {
  if (!this.options['skip-welcome-message']) {
    this.log(Messages(this).app.welcome());
  }
};

LeanerGenerator.prototype.generateProjectScaffold = function generateProjectScaffold() {
  async.series([
    function generateProjectRoot(next) {
      this.log(Messages(this).app.generateProjectRoot());
      Utils(this).copyTemplateDirectory('_root', Paths.dest.root);
      next();
    }.bind(this),
    function generateServerComponents(next) {
      this.log(Messages(this).app.generateServerComponents());
      Utils(this).copyTemplateDirectory('server', Paths.dest.server.root);
      next();
    }.bind(this),
    function generateClientComponents(next) {
      this.log(Messages(this).app.generateClientComponents());
      Utils(this).copyTemplateDirectory('client', Paths.dest.client.root);
      next();
    }.bind(this)
  ], function () {

  });
};

