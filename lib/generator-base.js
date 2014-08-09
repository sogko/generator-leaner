'use strict';

var yeoman = require('yeoman-generator');
var _ = require('lodash');

var MessagesMixins = require('../lib/mixins/messages');
var ActionsMixins = require('../lib/mixins/actions');
var PathsMixins = require('../lib/mixins/paths');

var LeanerGeneratorBase = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.option('force-overwrite', {
      desc: 'Force copy/writing over files with conflicts. Defaults to abort on conflict',
      type: Boolean,
      default: false
    });

    this.option('skip-conflicts', {
      desc: 'Skip copy/writing over files with conflicts',
      type: Boolean,
      default: false
    });

    this.option('skip-completed-message', {
      desc: 'Skip completion message',
      type: Boolean,
      default: false
    });

    // define generator messages
    this.defineMessages({
      app: require('../messages/app'),
      ngApp: require('../messages/ng-app'),
      ngController: require('../messages/ng-controller'),
      ngModule: require('../messages/ng-module')
    });
  }
});

// mix-ins
_.extend(LeanerGeneratorBase.prototype, PathsMixins);
_.extend(LeanerGeneratorBase.prototype, ActionsMixins);
_.extend(LeanerGeneratorBase.prototype, MessagesMixins);

module.exports = LeanerGeneratorBase;