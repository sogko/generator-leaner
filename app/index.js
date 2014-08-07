'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var LeanerGenerator = module.exports = function LeanerGenerator(args, options) {
  yeoman.generators.Base.apply(this, arguments);

  // init app name
  this.argument('appname', { type: String, required: false });
  this.appname = this.appname || path.basename(process.cwd());
  this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

  this.pkg = require('../package.json');

  this.on('end', function () {
    var endMessage =function endMessage() {
      this.log('\n\n' + chalk.green('success') + chalk.white(' Your LEANER app ' + chalk.bold(this.appname)+ ' has been created.'));
      this.log(chalk.green('Run ' + chalk.white.bold('npm start')+' to serve the app\n\n'));
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
    this.log(yosay('Welcome! \nLet\'s get leaner, my friend!'));
    this.log(
      chalk.magenta([
          'LEANER is a Lightweight & Leaner out-of-the-box ExpressJS-AngularJS-NodeJS-RequireJS Stack',
          '\n'
        ].join('')
      )
    );
  }
};

LeanerGenerator.prototype.generateAppRootFiles = function appRootFiles() {
  this._processDirectory('_root', '');
};

LeanerGenerator.prototype.generateServerScaffold = function generateScaffold() {
  this._processDirectory('server', 'server');
};

LeanerGenerator.prototype.generateClientScaffold = function generateScaffold() {
  this._processDirectory('client', 'client');
//  this.mkdir('client/app');
};

LeanerGenerator.prototype._askFor = function askFor() {

  var done = this.async();

  var prompts = [{
    type: 'confirm',
    name: 'someOption',
    message: 'Would you like to enable this option?',
    default: true
  }];

  this.prompt(prompts, function (props) {
    this.someOption = props.someOption;

    done();
  }.bind(this));

};

LeanerGenerator.prototype._processDirectory = function(source, destination) {
  var root = this.isPathAbsolute(source) ? source : path.join(this.sourceRoot(), source);
  var files = this.expandFiles('**', { dot: true, cwd: root });

  for (var i = 0; i < files.length; i++) {
    var f = files[i];
    var src = path.join(root, f);
    if(path.basename(f).indexOf('_') == 0){
      var dest = path.join(destination, path.dirname(f), path.basename(f).replace(/^_/, ''));
      this.template(src, dest);
    }
    else{
      var dest = path.join(destination, f);
      this.copy(src, dest);
    }
  }
};