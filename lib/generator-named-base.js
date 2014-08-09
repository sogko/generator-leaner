'use strict';

var yeoman = require('yeoman-generator');
var _ = require('lodash');

var MessagesMixins = require('../lib/mixins/messages');
var ActionsMixins = require('../lib/mixins/actions');
var PathsMixins = require('../lib/mixins/paths');

var LeanerGeneratorNamedBase = yeoman.generators.NamedBase.extend({
  constructor: function () {
    yeoman.generators.NamedBase.apply(this, arguments);

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
_.extend(LeanerGeneratorNamedBase.prototype, PathsMixins);
_.extend(LeanerGeneratorNamedBase.prototype, ActionsMixins);
_.extend(LeanerGeneratorNamedBase.prototype, MessagesMixins);

module.exports = LeanerGeneratorNamedBase;