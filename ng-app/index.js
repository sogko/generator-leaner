'use strict';
var fs = require('fs');
var falafel = require('falafel');
var async = require('async');
var _ = require('lodash');
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

  this.ng_appname = this._.camelize(this.name);

  this.on('end', function () {
    var endMessage =function endMessage() {
      this.log('\n\n' + chalk.green('success') + chalk.white(' Your angular app ' + chalk.bold(this.ng_appname)+ ' has been created and available at: '));
      this.log(chalk.white('\t' + chalk.bold('http://localhost:3000/'+this.ng_appname+'/') + ' (default) \n\n'));
    }.bind(this);
    this._createDefaultModules(function () {
      endMessage();
    });
  });
};

util.inherits(LeanerGenerator, yeoman.generators.NamedBase);

LeanerGenerator.prototype.checkIfAppExists = function generateAngularAppScaffold() {
  var baseFileName = 'client/main.js';
  var filePath = path.join(process.cwd(), baseFileName);
  if(!fs.existsSync(filePath)) {
    this.log(chalk.bgRed('Fatal Error: Main LEANER app does not exists or missing ' + chalk.white.bold(baseFileName)));
    this.log(chalk.cyan('Run '+ chalk.bold.white('yo leaner') + ' to init directory and generate main LEANER app'));
    process.exit(-1);
  }
};

LeanerGenerator.prototype.generateClientAppScaffold = function generateClientAppScaffold() {
  this._processDirectory('_app', 'client/app/' + this.ng_appname);
};

LeanerGenerator.prototype.createAppEndpointOnServer = function createAppEndpointOnServer() {
  this.copy('server/routes/_app.js', path.join('server/routes/', this.ng_appname + '.js'));
  this.copy('server/views/_app.hbs', path.join('server/views/', this.ng_appname + '.hbs'));
};

LeanerGenerator.prototype.wireClientMainEntryPoint = function wireClientMainEntryPoint() {

  var baseFileName = 'client/main.js';
  var filePath = path.join(process.cwd(), baseFileName);

  var hasChanges = false;
  var foundKeys = false;
  var didUpdatePackages = false;
  var didUpdateDependencies = false;

  var code = this.read(filePath);
  var output = falafel(code, {}, function (node) {

    // define app package
    if (node.type === 'Property'
      && node.key.name === 'packages'
      && node.value.type === 'ArrayExpression') {

      foundKeys = true;

      // find if app package already defined
      var isNewApp = true;
      _.forEach(node.value.elements, function (elem) {
        switch (elem.type) {
          case 'Literal':
            if (elem.value === this.ng_appname) isNewApp = false;
            break;
          case 'ObjectExpression':
            _.forEach(elem.properties, function (prop) {
              if (prop.value && prop.value.value === this.ng_appname) isNewApp = false;
            }.bind(this));
            break;
        }
      }.bind(this));

      if (isNewApp) {
        didUpdatePackages = true;
        hasChanges = true;
        var str = "{ name: '"+ this.ng_appname+"', location: 'app/"+ this.ng_appname +"' }";
        if (node.value.elements.length === 0) {
          node.value.update(['[\n    ', str, '\n  ]'].join(''));
        } else {
          var last = node.value.elements[node.value.elements.length-1];
          last.update(last.source() + ',\n    '+ str);
        }

      }
    }

    // define app package
    if (node.type === 'Property'
      && node.key.name === 'deps'
      && node.value.type === 'ArrayExpression') {

      foundKeys = true;

      // find if app package already added as a dependency
      var alreadyAdded = false;
      _.forEach(node.value.elements, function (elem) {
        switch (elem.type) {
          case 'Literal':
            if (elem.value === this.ng_appname) alreadyAdded = true;
            break;
        }
      }.bind(this));

      if (!alreadyAdded) {
        didUpdateDependencies = true;
        hasChanges = true;
        if (node.value.elements.length === 0) {
          node.value.update(['[\'', this.ng_appname, '\']'].join(''));
        } else {
          var last = node.value.elements[node.value.elements.length-1];
          last.update(last.source() + ', \''+ this.ng_appname + '\'');
        }

      }


    }

  }.bind(this));

  if (hasChanges) {
    fs.writeFileSync(filePath, output);

    if (didUpdatePackages) {
      this.log(chalk.green('updated ') + chalk.bold(baseFileName) + ' Added ' +this.ng_appname + " to 'config.packages'");
    }
    if (didUpdateDependencies) {
      this.log(chalk.green('updated ') + chalk.bold(baseFileName) + ' Added ' +this.ng_appname + " to 'config.deps'");
    }
  } else if (!hasChanges && foundKeys) {
    this.log(chalk.green('no changes ') + chalk.bold(baseFileName) + ' ' +this.ng_appname + ' already included previously');
  } else {
    this.log(chalk.green('no changes ') + chalk.bold(baseFileName) + chalk.yellow(' Unable to automatically include ' +
        this.ng_appname + '.\nYou may need to add it manually.' +
        '\nExample: \n' +
        'require.config({\n  ...\n' +
        '  packages: [ { name: \''+this.ng_appname+'\', location: \'app/'+this.ng_appname+'\' } ], \n' +
        '  ...\n'+
        '  deps: [\''+this.ng_appname+'\'] '+ chalk.grey('// bootstrap initial app, loads app/' + this.ng_appname + '/main.js') + '\n' +
        chalk.yellow('});')
    ));
  }
};
LeanerGenerator.prototype._createDefaultModules = function createDefaultModules(done) {
  async.series([
    function createControllersModule(next) {
      this.invoke('leaner:ng-module', { args: [ [this.ng_appname, 'controllers'].join('.')] }, next);
    }.bind(this),
    function createSampleIndexController(next) {
      this.invoke('leaner:ng-controller', { args: [ [this.ng_appname, 'controllers', 'IndexController'].join('.')], options: { 'include-sample': true } }, next);
    }.bind(this),
    function createFiltersModule(next) {
      this.invoke('leaner:ng-module', { args: [ [this.ng_appname, 'filters'].join('.')] }, next);
    }.bind(this),
    function createDirectivesModule(next) {
      this.invoke('leaner:ng-module', { args: [ [this.ng_appname, 'directives'].join('.')] }, next);
    }.bind(this),
    function createServicesModule(next) {
      this.invoke('leaner:ng-module', { args: [ [this.ng_appname, 'services'].join('.')] }, next);
    }.bind(this)
  ], function (err) {
    done(err);
  });
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