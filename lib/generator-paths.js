var path = require('path');
var util = require('util');

// define static methods
var Paths = {
  ngApp: {},
  ngController: {},
  ngModule: {},

  dest: {
    root: '',
    client: {
      root: 'client',
      apps: 'client/apps'
    },
    server: {
      root: 'server'
    }
  }
};

// define c'tor, extended with static methods
Paths = util._extend(function (generator){

  this.generator = generator;

  this.source = this.generator.sourceRoot();
  this.destination = this.generator.destinationRoot();

  this.src = {};
  this.src.defaultServerConfig = path.join(this.source, 'server', 'config');

  this.dest = {};
  this.dest.root = this.destination;
  this.dest.server = {};
  this.dest.server.root = path.join(this.destination, 'server');
  this.dest.client = {};
  this.dest.client.root = path.join(this.destination, 'client');
  this.dest.client.apps = path.join(this.dest.client.root, 'apps');

  return this;
}, Paths);

module.exports = Paths;