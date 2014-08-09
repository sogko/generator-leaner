'use strict';

var fs = require('fs');
var _ = require('lodash');
var falafel = require('falafel');
var path = require('path');

var LeanerGeneratorNamedBase = require('../lib/generator-named-base');

var LeanerGenerator = LeanerGeneratorNamedBase.extend({
  constructor: function () {
    LeanerGeneratorNamedBase.apply(this, arguments);

    if (this.name.split('.').length !== 3 && this.name.split('.')[1] !== 'controllers') {
      this.logMessage('ngController.errorExpectedNameArgumentWrongFormat');
      process.exit(-1);
    }

    this.projectName = this.currentProjectName();
    this.ngAppName = this.normalizeNgAppName(this.name.split('.')[0]);
    this.ngModuleName = this.normalizeNgModuleName(this.name.split('.')[1]); // 'controllers'
    this.ngModuleFullName = [this.ngAppName, this.ngModuleName].join('.');

    this.ngControllerNameUnderscored = this._.underscored(this.name.split('.')[2]); // eg: 'HomeController' -> 'home_controller'
    this.ngControllerName = this._.classify(this.ngControllerNameUnderscored);
    this.ngControllerFileName = this.ngControllerName + '.js';
    this.ngControllerFullName = [this.ngAppName, this.ngModuleName, this.ngControllerName].join('.');
    this.ngControllerFilePath = this.resolvesNgModuleRootPath(this.ngControllerFileName);
    this.ngControllerComponentFile = ['./', this.ngControllerName].join('');  // eg: ./HomeController

    this.includeSample = (this.options['include-sample'] === true);

    this.option('include-sample', {
      desc: 'Include sample controller implementation',
      type: Boolean,
      default: false
    });

//    this.logMessage('ngController.errorExpectedNameArgumentWrongFormat');
//    this.logMessage('ngController.errorNgControllerDoesNotExist');
//    this.logMessage('ngController.completed');
//    this.logMessage('ngController.generateControllerScaffold');
//    this.logMessage('ngController.wireControllerToLoaderDefinitions');
//    this.logMessage('ngController.didAddNgControllerToRequiredArray');
//    this.logMessage('ngController.ngControllerAlreadyExistsInPackages');
//    this.logMessage('ngController.unableToDefineNgControllerAutomatically');
//
//    process.exit(-1);

  },
  initializing: {
    checkIfProjectExists: function checkIfProjectExists() {
      var filePath = path.join(process.cwd(), this.paths.client.mainJs);
      if (!fs.existsSync(filePath)) {
        this.logMessage('ngApp.errorProjectDoesNotExist');
        process.exit(-1);
      }
    },
    checkIfNgAppExists: function checkIfNgAppExists() {
      var filePath = path.join(process.cwd(), this.resolvesNgAppRootPath());
      if (!fs.existsSync(filePath)) {
        this.logMessage('ngModule.errorNgAppDoesNotExist');
        process.exit(-1);
      }
    },
    checkControllersModuleExists: function checkControllersModuleExists() {
      var controllersModulePath = path.join(process.cwd(), this.resolvesNgModuleRootPath());
      if (!fs.existsSync(controllersModulePath)) {
        this.logMessage('ngController.errorNgControllerDoesNotExist');
        process.exit(-1);
      }
    }
  },
  prompting: {},
  configuring: {},
  default: {},
  writing: {
    generateControllerScaffold: function generateControllerScaffold() {
      this.logMessage('ngController.generateControllerScaffold');
      this.copy('_controller.js', this.ngControllerFilePath);

    },
    wireControllerToLoaderDefinitions: function wireControllerToLoaderDefinitions() {
      this.logMessage('ngController.wireControllerToLoaderDefinitions');
      this._wireControllerToLoaderDefinitions();
    },
    completed: function completed() {
      if (!this.options['skip-completed-message']){
        this.logMessage('ngController.completed');
      }
    }
  },
  conflicts: {},
  install: {},
  end: {}
});


LeanerGenerator.prototype._wireControllerToLoaderDefinitions = function _wireControllerToLoaderDefinitions() {
  var baseFileName = this.resolvesNgModuleRootPath('main.js');
  var filePath = path.join(process.cwd(), baseFileName);

  var hasChanges = false;
  var foundKeys = false;
  var didUpdateRequiredArray = false;

  var code = this.read(filePath);
  var output = falafel(code, {}, function (node) {

    // define([], function(){});
    if (node.type === 'CallExpression'
      && node.callee
      && node.callee.name === 'define'
      && node.arguments
      && node.arguments.length === 2
      && node.arguments[0].type === 'ArrayExpression'
      && node.arguments[1].type === 'FunctionExpression'
      ) {

      var defineRequireArray = node.arguments[0];

      foundKeys = true;

      var alreadyRequired = false;
      _.forEach(defineRequireArray.elements, function (elem) {
        if (elem.type === 'Literal'
          && elem.value === this.ngControllerComponentFile) {
          alreadyRequired = true;
        }
      }.bind(this));

      if (!alreadyRequired) {
        didUpdateRequiredArray = true;
        hasChanges = true;
        if (defineRequireArray.elements.length === 0) {
          defineRequireArray.update(['[\n  \'', this.ngControllerComponentFile, '\'\n]'].join(''));
        } else {
          var last = defineRequireArray.elements[defineRequireArray.elements.length-1];
          last.update(last.source() + ',\n  \''+ this.ngControllerComponentFile + '\'');
        }
      }
    }
  }.bind(this));

  if (hasChanges) {
    fs.writeFileSync(filePath, output);
  }

  if (hasChanges && didUpdateRequiredArray) {
    this.logMessage('ngController.didAddNgControllerToRequiredArray');
  } else if (!hasChanges && foundKeys) {
    this.logMessage('ngController.ngControllerAlreadyExistsInPackages');
  } else {
    this.logMessage('ngController.unableToDefineNgControllerAutomatically');
  }

};

module.exports = LeanerGenerator;