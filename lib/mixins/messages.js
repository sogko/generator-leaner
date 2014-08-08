/**
 * Mixin for LeanGenerator.prototype
 */

'use strict';

var chalk = require('chalk');

var messages = {
  app: require('./messages/app'),
  ngApp: require('./messages/ng-app'),
  ngController: {},
  ngModule: {}
};

var MessagesMixins = {
  messages: function (m) {

    var namespace = m.split('.').slice(0, -1);
    var message = m.split('.').slice(-1)[0];

    // traverse through messages namespace tree
    var test = messages[namespace[0]];
    for (var i = 1; i < namespace.length; i++) {
      if (!test) break;
      test =  test[namespace[i]];
    }

    // print message using generator.log();
    if (test && typeof test[message] === 'function') {
      return this.log(test[message].bind(this)());
    }
    if (test && typeof test[message] === 'string') {
      this.log(test[message]);
    }
    return this.log(chalk.yellow('<undefined message>'));
  }
};

module.exports = MessagesMixins;