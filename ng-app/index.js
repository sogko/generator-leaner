'use strict';
var fs = require('fs');
var falafel = require('falafel');
var async = require('async');
var _ = require('lodash');
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var MessagesMixins = require('../lib/mixins/messages');
var ActionsMixins = require('../lib/mixins/actions');
var PathsMixins = require('../lib/mixins/paths');

var LeanerGeneratorNamedBase = yeoman.generators.NamedBase.extend({});

// mix-ins
_.extend(LeanerGeneratorNamedBase.prototype, PathsMixins);
_.extend(LeanerGeneratorNamedBase.prototype, ActionsMixins);
_.extend(LeanerGeneratorNamedBase.prototype, MessagesMixins);

var LeanerGenerator = module.exports = LeanerGeneratorNamedBase.extend({
  constructor: function () {
    LeanerGeneratorNamedBase.apply(this, arguments);

    this.projectName = this.currentProjectName();
    this.ngAppName = this.normalizeNgAppName(this.name);

  },
  initializing: {
    checkIfProjectExists:function checkIfProjectExists() {
      var filePath = path.join(process.cwd(), this.paths.client.mainJs);
      if (!fs.existsSync(filePath)) {
        this.messages('ngApp.errorProjectDoesNotExist');
        process.exit(-1);
      }
    }
  },
  prompting: {},
  configuring: {},
  default: {},
  writing: {
    generateAppScaffold: function generateAppScaffold() {
      async.series([
        function generateClientApp(next) {
          this.messages('ngApp.generateClientApp');
          this.copyTemplateDirectory('_apps', this.resolvesNgAppRootPath());
          next();
        }.bind(this),
        function createAppEndpointOnServer(next) {
          this.messages('ngApp.createAppEndpointOnServer');
          this.copy('server/routes/_app.js', path.join('server/routes/', this.ngAppName + '.js'));
          this.copy('server/views/_app.hbs', path.join('server/views/', this.ngAppName, 'home.hbs'));
          next();
        }.bind(this),
        function wireClientMainJs(next) {
          this.messages('ngApp.wireClientMainJs');
          this._wireClientMainJs();
          next();
        }.bind(this),
        function createDefaultModules(next) {
          this.messages('ngApp.createDefaultModules');
          this._createDefaultModules(next);
        }.bind(this),
        function completed(next) {
          this.messages('ngApp.completed');

          this.log('asdsad', this.appUrl());
          next();
        }.bind(this)
      ], function () {
        // TODO: check for errors here and show appropriate message
      });
    }
  },
  conflicts: {},
  install: {},
  end: {}
});

LeanerGenerator.prototype._wireClientMainJs = function _wireClientMainJs() {

  var baseFileName = this.paths.client.mainJs;
  var filePath = path.join(process.cwd(), baseFileName);

  var hasChanges = false;
  var foundKeys = false;
  var didAddNgAppToPackages = false;

  var code = this.read(filePath);
  var output = falafel(code, {}, function (node) {

    // packages: []
    if (node.type === 'Property'
      && node.key.name === 'packages'
      && node.value.type === 'ArrayExpression') {

      foundKeys = true;

      // find if app package already defined
      var isNewApp = true;
      _.forEach(node.value.elements, function (elem) {
        switch (elem.type) {
          case 'Literal':
            if (elem.value === this.ngAppName) isNewApp = false;
            break;
          case 'ObjectExpression':
            _.forEach(elem.properties, function (prop) {
              if (prop.value && prop.value.value === this.ngAppName) isNewApp = false;
            }.bind(this));
            break;
        }
      }.bind(this));

      if (isNewApp) {
        didAddNgAppToPackages = true;
        hasChanges = true;
        var str = "{ name: '"+ this.ngAppName+"', location: 'apps/"+ this.ngAppName +"' }";
        if (node.value.elements.length === 0) {
          node.value.update(['[\n    ', str, '\n  ]'].join(''));
        } else {
          var last = node.value.elements[node.value.elements.length-1];
          last.update(last.source() + ',\n    '+ str);
        }

      }
    }

  }.bind(this));

  if (hasChanges) {
    fs.writeFileSync(filePath, output);
  }

  if (hasChanges && didAddNgAppToPackages) {
    this.messages('ngApp.didAddNgAppToPackages');
  } else if (!hasChanges && foundKeys) {
    this.messages('ngApp.ngAppAlreadyExistsInPackages');
  } else {
    this.messages('ngApp.unableToDefineNgAppAutomatically');
  }
};

LeanerGenerator.prototype._createDefaultModules = function createDefaultModules(done) {
  async.series([
    function createControllersModule(next) {
      this.invoke('leaner:ng-module', { args: [ [this.ngAppName, 'controllers'].join('.')] }, next);
    }.bind(this),
    function createSampleHomeController(next) {
      this.invoke('leaner:ng-controller', { args: [ [this.ngAppName, 'controllers', 'HomeController'].join('.')], options: { 'include-sample': true } }, next);
    }.bind(this),
    function createFiltersModule(next) {
      this.invoke('leaner:ng-module', { args: [ [this.ngAppName, 'filters'].join('.')] }, next);
    }.bind(this),
    function createDirectivesModule(next) {
      this.invoke('leaner:ng-module', { args: [ [this.ngAppName, 'directives'].join('.')] }, next);
    }.bind(this),
    function createServicesModule(next) {
      this.invoke('leaner:ng-module', { args: [ [this.ngAppName, 'services'].join('.')] }, next);
    }.bind(this)
  ], function (err) {
    done(err);
  });
};
