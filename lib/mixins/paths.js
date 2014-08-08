/**
 * Mixin for LeanGenerator.prototype
 */

'use strict';

var path = require('path');
var url = require('url');
var util = require('util');

var yeoman = require('yeoman-generator');

var PathsStatics = {};
PathsStatics.root = '';
PathsStatics.client = {};
PathsStatics.client.root = path.join(PathsStatics.root, 'client');
PathsStatics.client.apps = {};
PathsStatics.client.apps.root = path.join(PathsStatics.client.root, 'apps');
PathsStatics.client.mainJs = path.join(PathsStatics.client.root, 'main.js');
PathsStatics.server = {};
PathsStatics.server.root = path.join(PathsStatics.root, 'server');
PathsStatics.server.config = path.join(PathsStatics.server.root, 'config');


var PathsMixins = {

  paths: PathsStatics,
  resolveSource: function(p) {
    return path.join(this.sourceRoot(), p);
  },
  resolveDestination: function(p) {
    return path.join(this.destinationRoot(), p);
  },
  resolvesNgAppRootPath: function () {
    return path.join(this.paths.client.apps.root, this.ngAppName || '<undefined>')
  },

  normalizeProjectName: function (val) {
    return this._.camelize(this._.slugify(this._.humanize(val)));
  },
  normalizeNgAppName: function (val) {
    return this._.classify(this._.slugify(this._.humanize(val)));
  },

  currentProjectName: function () {
    try {
      this.projectName = require(path.join(process.cwd(), 'bower.json')).name;
    } catch (e) {

    }
    this.projectName = this.projectName || path.basename(process.cwd());
    this.projectName = this.normalizeProjectName(this.projectName);
    return this.projectName;
  },

  serverBaseHttpUrl: function () {
    var serverConfig;
    try {
      serverConfig = require(this.resolveDestination(this.paths.server.config) || this.resolveSource(this.paths.server.config));
    } catch (e) {

    }
    return url.format({
      protocol: 'http',
      hostname: 'localhost',
      port: serverConfig.port,
      pathname: '/'
    });

  },

  appUrl: function (appName) {
    return [this.serverBaseHttpUrl(), appName || this.ngAppName || '<ngAppName>', '/'].join('');
  }

};

module.exports = PathsMixins;