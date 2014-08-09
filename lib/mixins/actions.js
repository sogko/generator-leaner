/**
 * Mixin for LeanGenerator.prototype
 */

'use strict';

var path = require('path');
var chalk = require('chalk');
var fs = require('fs');
var mkdirp = require('mkdirp');
var isBinaryFile = require('isbinaryfile');

var ActionsMixins = {

  /**
   * override weird async/sync mix write/copy operations with synchronous versions
   * the following methods are now synchronous
   * this.copy()
   * this.write()
   *
   * implemented a synchronous version of collision check
   * this.checkForCollisionSync()
   */
  copy: function copy(source, destination, process) {

    var file = this._prepCopy(source, destination, process);

    try {
      file.body = this.engine(file.body, this);
    } catch (err) {
      // this happens in some cases when trying to copy a JS file like lodash/underscore
      // (conflicting the templating engine)
    }

    var status = this.checkForCollisionSync(file.destination, file.body);
    if (!/force|create/.test(status)) {
      return;
    }

    var stats;
    mkdirp.sync(path.dirname(file.destination));
    fs.writeFileSync(file.destination, file.body);

    // synchronize stats and modification times from the original file.
    stats = fs.statSync(file.source);
    try {
      fs.chmodSync(file.destination, stats.mode);
      fs.utimesSync(file.destination, stats.atime, stats.mtime);
    } catch (err) {
      this.log.error('Error setting permissions of "' + chalk.bold(file.destination) + '" file: ' + err);
    }

    return this;
  },

  write: function write(filepath, content, writeFile) {

    var status = this.checkForCollisionSync(filepath, content);
    if (!/force|create/.test(status)) {
      return;
    }
    mkdirp.sync(path.dirname(filepath));
    fs.writeFileSync(filepath, content, writeFile);
    return this;
  },

  checkForCollisionSync: function checkForCollision(filepath, content) {
    var rfilepath = path.relative(process.cwd(), path.resolve(filepath));
    if (!fs.existsSync(filepath)) {
      this.log.create(rfilepath);
      return 'create';
    }

    if (!fs.statSync(path.resolve(filepath)).isDirectory()) {
      var encoding = null;
      if (!isBinaryFile(path.resolve(filepath))) {
        encoding = 'utf8';
      }

      var actual = fs.readFileSync(path.resolve(filepath), encoding);

      // In case of binary content, `actual` and `content` are `Buffer` objects,
      // we just can't compare those 2 objects with standard `===`,
      // so we convert each binary content to an hexadecimal string first, and then compare them with standard `===`
      //
      // For not binary content, we can directly compare the 2 strings this way
      if ((!encoding && (actual.toString('hex') === content.toString('hex'))) ||
        (actual === content)) {
        this.log.identical(rfilepath);
        return 'identical';
      }
    }

    if (this.options['skip-conflicts']) {
      this.log.skip(rfilepath);
      return 'skipped';
    }

    if (this.options['force-overwrite']) {
      this.log.force(rfilepath);
      return 'force';
    }

    this.log.conflict(rfilepath);
    this.log(chalk.yellow('\nOperation aborted (no changes made)'));
    this.log('- Set ' + chalk.bold('--force-overwrite')+ ' option to force overwrite over conflicts');
    this.log('- Set ' + chalk.bold('--skip-conflicts')+ ' option to skip over conflicts (no changes made)');
//    this.log();
    this.log('--------------------------------------------------------');
    this.log();

    // show file diffs
    this.log('Diffs for file with conflict: ' + chalk.bold(filepath));
    this.env.adapter.diff(fs.readFileSync(filepath, 'utf8'), content);

    process.exit(-1);

    return 'conflict';
  },

  copyTemplateDirectory: function copyTemplateDirectory(source, destination) {

    var root = this.isPathAbsolute(source) ? source : path.join(this.sourceRoot(), source);
    var files = this.expandFiles('**', { dot: true, cwd: root });

    for (var i = 0; i < files.length; i++) {
      var f = files[i];
      var src = path.join(root, f);
      if (path.basename(f).indexOf('_') == 0) {
        var dest = path.join(destination, path.dirname(f), path.basename(f).replace(/^_/, ''));
        //console.log('template', src,dest, this.destinationRoot());
        this.template(src, dest);
      } else {
        var dest = path.join(destination, f);
        //console.log('copy ', src,dest);
        this.copy(src, dest);
      }
    }
  }

};
module.exports = ActionsMixins;