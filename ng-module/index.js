'use strict';
var fs = require('fs');
var _ = require('lodash');
var falafel = require('falafel');
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var angularUtils = require('../util.js');

var LeanerGenerator = module.exports = function LeanerGenerator(args, options) {
  yeoman.generators.NamedBase.apply(this, arguments);

  try {
    this.appname = require(path.join(process.cwd(), 'bower.json')).name;
  } catch (e) {
    this.appname = path.basename(process.cwd());
  }
  this.appname = this._.slugify(this._.humanize(this.appname));
  this.scriptAppName = this._.camelize(this.appname) + angularUtils.appName(this);

  if (this.name.split('.').length !== 2) {
    this.log(chalk.bgRed.white.bold("Error: Expected name to be in '<ngAppName>.<ngAppModuleName>' format. For example: 'yo leaner:ng-module myApp.controllers'"));
    process.exit(-1);
  }
  this.ng_appname = this._.camelize(this.name.split('.')[0]);
  this.ng_moduleName = this._.camelize(this.name.split('.')[1]);
  this.ng_moduleFullName = [this.ng_appname, this.ng_moduleName].join('.');
  // check if ng-app exists

  this.on('end', function () {
    var endMessage =function endMessage() {
      this.log('\n\n' + chalk.green('success') + chalk.white(' Your angular app module ' + chalk.bold(this.ng_moduleFullName)+ ' has been created.\n\n'));
    }.bind(this);
    endMessage();

  });
};

util.inherits(LeanerGenerator, yeoman.generators.Base);

LeanerGenerator.prototype.generateAppModuleScaffold = function generateAppModuleScaffold() {

  var baseDir = path.join('client/app', this.ng_appname, this.ng_moduleName);

  this._processDirectory('_module', baseDir);

};

LeanerGenerator.prototype.wireModuleToAppDefintions = function wireModuleToAppDefintions() {

  var baseFileName = path.join('client/app', this.ng_appname, 'app.js');
  var filePath = path.join(process.cwd(), baseFileName);
  var moduleIndex = path.join(this.ng_appname, this.ng_moduleName, 'index');
  var moduleFullName = this.ng_moduleFullName;
  var hasChanges = false;
  var foundKeys = false;
  var didUpdateRequiredArray = false;
  var didUpdateModuleArray = false;

  var code = this.read(filePath);
  var output = falafel(code, {}, function (node) {

    // require module

    if (node.type === 'CallExpression'
      && node.callee
      && node.callee.name === 'define'
      && node.arguments
      && node.arguments.length === 2
      && node.arguments[0].type === 'ArrayExpression'
      && node.arguments[1].type === 'FunctionExpression'
      ) {

      var defineRequireArray = node.arguments[0];
      var defineFunc = node.arguments[1];

      foundKeys = true;

      var alreadyRequired = false;
      _.forEach(defineRequireArray.elements, function (elem) {
        switch (elem.type) {
          case 'Literal':
            if (elem.value === moduleIndex) alreadyRequired = true;
            break;
        }
      });

      if (!alreadyRequired) {
        didUpdateRequiredArray = true;
        hasChanges = true;
        if (defineRequireArray.elements.length === 0) {
          defineRequireArray.update(['[\n  \'', moduleIndex, '\'\n]'].join(''));
        } else {
          var last = defineRequireArray.elements[defineRequireArray.elements.length-1];
          last.update(last.source() + ',\n  \''+ moduleIndex + '\'');
        }
      }

      var alreadyAddedToModule = false;
      var moduleArray = null;
      if (defineFunc.body
        && defineFunc.body.type === 'BlockStatement'
        && defineFunc.body.body
        && defineFunc.body.body.length > 0) {
        _.forEach(defineFunc.body.body, function (elem) {
          if (elem.type === 'ReturnStatement'
            && elem.argument
            && elem.argument.type === 'CallExpression'
            && elem.argument.arguments
            && elem.argument.arguments.length > 0) {
            _.forEach(elem.argument.arguments, function (arg) {
              if (arg.type === 'ArrayExpression') {
                moduleArray = arg;
                _.forEach(arg.elements, function (elem) {
                  if (elem.type === 'Literal' && elem.value === moduleFullName) {
                    alreadyAddedToModule = true;
                  }
                });
              }
            });
          }
        });
      }

      if (!alreadyAddedToModule && moduleArray) {
        didUpdateModuleArray = true;
        hasChanges = true;
        if (moduleArray.elements.length === 0) {
          moduleArray.update(['[\n    \'', moduleFullName, '\'\n  ]'].join(''));
        } else {
          var last = moduleArray.elements[moduleArray.elements.length-1];
          last.update(last.source() + ',\n    \''+ moduleFullName + '\'');
        }
      }

    }

  }.bind(this));

  if (hasChanges) {
    fs.writeFileSync(filePath, output);

    if (didUpdateRequiredArray) {
      this.log(chalk.green('updated ') + chalk.bold(baseFileName) + ' Required ' + chalk.cyan(moduleIndex) + ' module');
    }
    if (didUpdateModuleArray) {
      this.log(chalk.green('updated ') + chalk.bold(baseFileName) + ' Added ' + chalk.cyan(moduleFullName) + ' to ng.module(\'' + this.ng_appname + '\')');
    }
  } else if (!hasChanges && foundKeys) {
    this.log(chalk.green('no changes ') + chalk.bold(baseFileName) + ' Module ' + chalk.cyan(this.ng_moduleFullName) + ' already configured previously');
  } else {
    this.log(chalk.green('no changes ') +
        chalk.bold(baseFileName) +
        chalk.yellow(' Unable to automatically include ' +
          this.ng_moduleFullName + '. You may need to add it manually.' +
          '\nExample: \n' +
          'define.([\n' +
          '  \'require\',\n' +
          '  \'angular\',\n' +
          '  ...\n' +
          '  \'') +  chalk.white(moduleIndex) + chalk.yellow('\'') + chalk.grey(' // require module loader file') + chalk.yellow('\n' +
          '], function (require, ng) {\n  ...\n'+
          '  return ng.module(\'LAVA\', [\n'+
          '    ...\n' +
          '  \'') +  chalk.white(moduleFullName) +  chalk.yellow('\'') + chalk.grey(' // add module to ng-app') + chalk.yellow('\n' +
          '  ]);\n' +
          '});'
      )
    );
  }
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