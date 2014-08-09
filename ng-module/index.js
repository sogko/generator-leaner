'use strict';

var fs = require('fs');
var _ = require('lodash');
var falafel = require('falafel');
var path = require('path');

var LeanerGeneratorNamedBase = require('../lib/generator-named-base');

var LeanerGenerator = LeanerGeneratorNamedBase.extend({
  constructor: function () {
    LeanerGeneratorNamedBase.apply(this, arguments);

    if (this.name.split('.').length !== 2) {
      this.logMessage('ngModule.errorExpectedNameArgumentWrongFormat');
      process.exit(-1);
    }

    this.projectName = this.currentProjectName();
    this.ngAppName = this.normalizeNgAppName(this.name.split('.')[0]);
    this.ngModuleName = this.normalizeNgModuleName(this.name.split('.')[1]);
    this.ngModuleFullName = [this.ngAppName, this.ngModuleName].join('.');

    this.option('skip-completed-message', {
      desc: 'Skip completion message',
      type: Boolean,
      default: false
    });

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
    }
  },
  prompting: {},
  configuring: {},
  default: {},
  writing: {
    generateAppModuleScaffold: function generateAppModuleScaffold() {
      this.logMessage('ngModule.generateAppModuleScaffold');
      var baseDir = path.join('client/apps', this.ngAppName, this.ngModuleName);
      this.copyTemplateDirectory('_module', baseDir);

    },
    wireModuleToAppDefinitions: function wireModuleToAppDefinitions() {
      this.logMessage('ngModule.wireModuleToAppDefinitions');
      this._wireModuleToAppDefinitions();
    },
    completed: function completed() {
      if (!this.options['skip-completed-message']){
        this.logMessage('ngModule.completed');
      }
    }
  },
  conflicts: {},
  install: {},
  end: {}
});

LeanerGenerator.prototype._wireModuleToAppDefinitions = function _wireModuleToAppDefinitions() {

  var baseFileName = this.resolvesNgAppRootPath('app.js');
  var filePath = path.join(process.cwd(), baseFileName);
  var moduleIndex = path.join(this.ngAppName, this.ngModuleName, 'main');
  var moduleFullName = this.ngModuleFullName;
  var hasChanges = false;
  var foundKeys = false;
  var didUpdateRequiredArray = false;
  var didUpdateModuleArray = false;

  var code = this.read(filePath);
  var output = falafel(code, {}, function (node) {

    // require module
    // define([], function () {} )
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
      // return ng.module( ..., [], ...);
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
  }

  if (hasChanges && didUpdateRequiredArray) {
    this.logMessage('ngModule.didAddNgModuleToRequiredArray');
  } else if (hasChanges && didUpdateModuleArray) {
    this.logMessage('ngModule.didAddNgModuleToModuleArray');
  } else if (!hasChanges && foundKeys) {
    this.logMessage('ngModule.ngModuleAlreadyExistsInPackages');
  } else {
    this.logMessage('ngModule.unableToDefineNgModuleAutomatically');
  }
};

module.exports = LeanerGenerator;