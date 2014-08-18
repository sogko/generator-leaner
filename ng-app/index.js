'use strict';

var fs = require('fs');
var falafel = require('falafel');
var async = require('async');
var _ = require('lodash');
var path = require('path');

var LeanerGeneratorNamedBase = require('../lib/generator-named-base');

var LeanerGenerator = LeanerGeneratorNamedBase.extend({
  constructor: function () {
    LeanerGeneratorNamedBase.apply(this, arguments);

    this.projectName = this.currentProjectName();
    this.ngAppName = this.normalizeNgAppName(this.name);

    this.on('error', function (err) {
      this.log('ERROR', err);
      process.exit(-1);
    }.bind(this));

  },
  initializing: {
    checkIfProjectExists: function checkIfProjectExists() {
//      var filePath = path.join(process.cwd(), this.paths.client.mainJs);
//      if (!fs.existsSync(filePath)) {
//        this.logMessage('ngApp.errorProjectDoesNotExist');
//        process.exit(-1);
//      }
    }
  },
  prompting: {},
  configuring: {},
  default: {},
  writing: {
    generateClientApp: function generateClientApp() {
      this.logMessage('ngApp.generateClientApp');
      this.copyTemplateDirectory('_app', this.resolvesNgAppRootPath());
    },
    createAppEndpointOnServer: function createAppEndpointOnServer() {
      this.logMessage('ngApp.createAppEndpointOnServer');
      this.copy('server/routes/_app.js', path.join('server/routes/', this.ngAppName + '.js'));
      this.copy('server/views/_app.hbs', path.join('server/views/', this.ngAppName, 'home.hbs'));
    },
//    wireClientMainJs: function wireClientMainJs() {
//      this.logMessage('ngApp.wireClientMainJs');
//      this._wireClientMainJs();
//    },
    createDefaultModules: function createDefaultModules() {
      var done = this.async();
      this.logMessage('ngApp.createDefaultModules');
      this._createDefaultModulesAsync(done);
    },
    completed: function completed() {
      this.logMessage('ngApp.completed');
    }
  },
  conflicts: {},
  install: {},
  end: {}
});

LeanerGenerator.prototype._wireClientMainJs = function _wireClientMainJs() {

  var baseFileName = this.paths.client.mainJs;
  var filePath = path.join(process.cwd(), baseFileName);

  var isNewApp;
  var str;
  var last;

  var hasChanges = false;
  var foundKeys = false;
  var didAddNgAppToPackages = false;
  var didAddNgAppToDependencies = false;

  var code = this.read(filePath);
  var output = falafel(code, {}, function (node) {

    // packages: []
    if (node.type === 'Property' &&
      node.key.name === 'packages' &&
      node.value.type === 'ArrayExpression') {

      foundKeys = true;

      // find if app package already defined
      isNewApp = true;
      _.forEach(node.value.elements, function (elem) {
        switch (elem.type) {
          case 'Literal':
            if (elem.value === this.ngAppName) { isNewApp = false; }
            break;
          case 'ObjectExpression':
            _.forEach(elem.properties, function (prop) {
              if (prop.value && prop.value.value === this.ngAppName) { isNewApp = false; }
            }.bind(this));
            break;
        }
      }.bind(this));

      if (isNewApp) {
        didAddNgAppToPackages = true;
        hasChanges = true;
        str = '\'{ name: \'' + this.ngAppName + '\', location: \'apps/' + this.ngAppName + '\' }';
        if (node.value.elements.length === 0) {
          node.value.update(['[\n    ', str, '\n  ]'].join(''));
        } else {
          last = node.value.elements[node.value.elements.length - 1];
          last.update(last.source() + ',\n    ' + str);
        }

      }
    }


    // disable writing to deps[], since we don't load ng-app until loaded from app's endpoint
    var writeToDependencies = false;

    // deps: [] (NOTE: disabled)
    if (writeToDependencies === true &&
      node.type === 'Property' &&
      node.key.name === 'deps' &&
      node.value.type === 'ArrayExpression') {

      foundKeys = true;

      // find if app package already defined
      isNewApp = true;
      _.forEach(node.value.elements, function (elem) {
        if (elem.type === 'Literal' && elem.value === this.ngAppName) { isNewApp = false; }
      }.bind(this));

      if (isNewApp) {
        didAddNgAppToDependencies = true;
        hasChanges = true;
        str = '\'' + this.ngAppName + '\'';
        if (node.value.elements.length === 0) {
          node.value.update(['[\n    ', str, '\n  ]'].join(''));
        } else {
          last = node.value.elements[node.value.elements.length - 1];
          last.update(last.source() + ',\n    ' + str);
        }
      }
    }

  }.bind(this));

  if (hasChanges) {
    fs.writeFileSync(filePath, output);
  }

  if (hasChanges) {
    if (didAddNgAppToPackages) { this.logMessage('ngApp.didAddNgAppToPackages'); }
    if (didAddNgAppToDependencies) { this.logMessage('ngApp.didAddNgAppToDependencies'); }
  } else if (!hasChanges && foundKeys) {
    this.logMessage('ngApp.ngAppAlreadyExistsInPackages');
  } else {
    this.logMessage('ngApp.unableToDefineNgAppAutomatically');
  }
};

LeanerGenerator.prototype._createDefaultModulesAsync = function createDefaultModules(done) {

  var currentOptions = {
    'skip-conflicts': this.options['skip-conflicts'],
    'force-overwrite': this.options['force-overwrite']
  };
  async.series([
    function createControllersModule(next) {
      this.invoke('leaner:ng-module', {
        args: [ [this.ngAppName, 'controllers'].join('.')],
        options: _.extend(currentOptions, {
          'skip-completed-message': true
        })
      }, next);
    }.bind(this),
    function createSampleHomeController(next) {
      this.invoke('leaner:ng-controller', {
        args: [ [this.ngAppName, 'controllers', 'HomeController'].join('.')],
        options: _.extend(currentOptions, {
          'include-sample': true
        })
      }, next);
    }.bind(this),
    function createFiltersModule(next) {
      this.invoke('leaner:ng-module', {
        args: [ [this.ngAppName, 'filters'].join('.')],
        options: _.extend(currentOptions, {
          'skip-completed-message': true
        })
      }, next);
    }.bind(this),
    function createDirectivesModule(next) {
      this.invoke('leaner:ng-module', {
        args: [ [this.ngAppName, 'directives'].join('.')],
        options: _.extend(currentOptions, {
          'skip-completed-message': true
        })
      }, next);
    }.bind(this),
    function createServicesModule(next) {
      this.invoke('leaner:ng-module', {
        args: [ [this.ngAppName, 'services'].join('.')],
        options: _.extend(currentOptions, {
          'skip-completed-message': true
        })
      }, next);
    }.bind(this)
  ], function (err) {
    done(err);
  });
};

module.exports = LeanerGenerator;