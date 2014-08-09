/**
 * Usage:
 *
 * npm install yeoman-generator-messages-mixins
 *
 * ...
 *
 * var util = require('util');
 * var yeoman = require('yeoman-generator');
 * var MessagesMixins = require('yeoman-generator-messages-mixins');
 *
 * var MyBase = module.exports = yeoman.generators.Base.extend({
 *    constructor: {
 *
 *      // Constructor implementation here
 *      // ...
 *
 *      // create member property that can be
 *      // used referred in our messages
 *      this.objectName = 'MyObject';
 *
 *      // define messages for our generator
 *      this.defineMessages({
 *
 *        // simple string message
 *        success: 'Success!',
 *
 *        error: {
 *
 *          // example of nested message namespace ('error.notFound')
 *          notFound: 'Object not found!',
 *
 *          // use a function to define a message string,
 *          // and making use of generator's member variables/methods
 *          invalidObject: function () {
 *            return this.objectName + ' is invalid!';
 *          }
 *        }
 *      });
 *    },
 *
 *    someMethod: function () {
 *      ...
 *
 *      // this.logMessage() uses generator.log() internally
 *      this.logMessage('success');              //-> 'Success!';
 *      this.logMessage('error.notFound');       //-> 'Object not found!';
 *      this.logMessage('error.invalidObject');  //-> 'MyObject not found!';
 *
 *    }
 * });
 *
 * // mixin into our MyBase prototypes
 * util._extend(MyBase.prototype, MessagesMixins);
 */

'use strict';

var chalk = require('chalk');

var MessagesMixins = {

  __messages: {},

  defineMessages: function(messages) {

    if (typeof messages !== 'object') return;
    this.__messages = messages;
  },
  logMessage: function (key) {

    var namespace = key.split('.').slice(0, -1);
    var message = key.split('.').slice(-1)[0];

    // traverse through messages namespace tree
    var test = this.__messages[namespace[0]];
    for (var i = 1; i < namespace.length; i++) {
      if (!test) break;
      test =  test[namespace[i]];
    }

    // print message using generator.log();
    if (test && typeof test[message] === 'function') {
      return this.log(test[message].bind(this)());
    }
    if (test && typeof test[message] === 'string') {
      return this.log(test[message]);
    }
    return this.log([
      chalk.cyan.bold('logMessage '),
      chalk.white.bold(key)
    ].join(''));
  }
};

module.exports = MessagesMixins;