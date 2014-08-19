'use strict';
var _ = require('lodash');
var path = require('path');
var bowerResolve = require('bower-resolve');
var npmResolve = require('resolve');

function parseClientBuildBundlesConfig(baseDir, opts) {
  var bundlesRaw = opts || [];
  var bundleNames = _.map(bundlesRaw, 'name');

  // preprocess bundle
  var bundles = [];
  _.forEach(bundlesRaw, function (b) {
    var bundleOpts = _.cloneDeep(b);
    var req = [];
    var external = [];
    var entries = [];

    if (!bundleOpts.name) { return; }

    bundleOpts.concat = (bundleOpts.concat !== false);

    // handle entries[]
    if (bundleOpts.entries && !_.isArray(bundleOpts.entries)) {
      bundleOpts.entries = [bundleOpts.entries];
    }
    _.forEach(bundleOpts.entries, function (e) {
      if (!e) { return; }
      entries.push(path.join(baseDir, e));
    });

    // handle require[]
    if (bundleOpts.require && _.isString(bundleOpts.require)) {
      bundleOpts.require = {
        type: 'default',
        name: bundleOpts.require,
        location: path.join(baseDir, bundleOpts.require)
      };
    }
    if (bundleOpts.require && !_.isArray(bundleOpts.require)) {
      bundleOpts.require = [bundleOpts.require];
    }
    _.forEach(bundleOpts.require, function (r) {
      if (!r.name) { return; }

      var type = (r.type || 'default').toLowerCase();
      var name = r.name;
      var expose = r.expose || name;
      var location = (r.location) ? path.join(baseDir, r.location) : null;
      if (!location) {
        // TODO: handle error if name points to non-existing bower/npm module
        switch (type) {
          case 'bower':
            location = bowerResolve.fastReadSync(name);
            break;
          case 'npm':
            location = npmResolve.sync(name);
            break;
          case 'default':
            location = require.resolve(path.join(baseDir, name));
            break;
          default:
            location = require.resolve(path.join(baseDir, name));
            break;
        }
      }
      req.push({ type: type, name: name, expose: expose, location: location });
    });

    // handle external[]
    if (bundleOpts.external && !_.isArray(bundleOpts.external)) {
      bundleOpts.external = [bundleOpts.external];
    }
    _.forEach(bundleOpts.external, function (ext) {
      if (_.isString(ext) && _.indexOf(bundleNames, ext) > -1) {
        ext = { type: 'bundle', name: ext };
      } else if (_.isString(ext) && _.indexOf(bundleNames, ext) <= -1) {
        ext = { type: 'module', name: ext };
      }
      if (!ext.name) { return; }
      external.push({ type: ext.type || 'module', name: ext.name });
    });

    bundles.push({
      name: bundleOpts.name,
      entries: entries,
      concat: bundleOpts.concat,
      require: req,
      external: external
    });
  });

  // update bundle names
  bundleNames = _.map(bundles, 'name');

  // resolve bundleOpts.external
  _.forEach(bundles, function (b) {
    var external = [];
    _.forEach(b.external, function (ext) {
      if (ext.type === 'bundle' && bundleNames.indexOf(ext.name) > -1) {
        _.forEach(bundles[bundleNames.indexOf(ext.name)].require, function(req) {
          external.push(req.expose);
        });
      } else if (ext.type === 'module') {
        external.push(ext.name);
      }
    });
    b.external = _.uniq(external);
  });
  return bundles;
}

function parseClientBuildConfig(opts) {
  var baseDir = opts.baseDir || process.cwd();
  var destDir = path.join(baseDir, opts.destDir || 'build');

  return {
    baseDir: baseDir,
    destDir: destDir,
    bundles: parseClientBuildBundlesConfig(baseDir, opts.bundles)
  };
}
module.exports = {
  parseClientBuildConfig: parseClientBuildConfig
};