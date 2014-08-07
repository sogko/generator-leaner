var chalk = require('chalk');
var yosay = require('yosay');

var Paths = require('./generator-paths');

var Messages = function (generator) {

  return {

    app: {
      welcome: function () {
        return [
          yosay('Welcome! \nLet\'s get leaner, my friend!'),
          banner('white', 'What is a LEANER stack?'),
          'LEANER is a Lightweight & Leaner ExpressJS-AngularJS-NodeJS-RequireJS Stack',
          '\n'
        ].join('');
      },
      completed: function () {
        var defaultConfig = require(Paths(generator).src.defaultServerConfig);
        return [
          '\n',
          '\n',
          banner('success', 'Completed'),
          chalk.white('Your LEANER app ' + chalk.bold(generator.projectName) + ' has been created.'),
          '\n',
          '\n',
          banner('info', 'Quick Start Tips'),
          list(null, '1. '), 'Run ', chalk.cyan('npm start'), ' to serve the app at ' ,
          chalk.bold('http://localhost:' + defaultConfig.port + '/'),
          '\n',
          '\n',
          list(null, '2. '), 'Run ' + chalk.cyan('yo leaner:ng-app <angularAppName>') , ' to create an AngularJS app at ',
          chalk.bold('http://localhost:' + defaultConfig.port + '/<angularAppName>/'),
          '\n',
          '\n'
        ].join('');
      },
      generateProjectRoot: function() {
        return [
          '\n',
          label('cyan', 'info'),
          chalk.white('Generating project root scaffold in '),
          chalk.bold(Paths(generator).dest.root),
          '\n'
        ].join('');
      },
      generateServerComponents: function() {
        return [
          '\n',
          label('cyan', 'info'),
          chalk.white('Generating ExpressJS server scaffold in '),
          chalk.bold(Paths(generator).dest.server.root),
          '\n'
        ].join('');
      },
      generateClientComponents: function() {
        return [
          '\n',
          label('cyan', 'info'),
          chalk.white('Generating AngularJS client scaffold in '),
          chalk.bold(Paths(generator).dest.client.root),
          '\n'
        ].join('');
      }
    },

    ngApp: {},
    ngController: {},
    ngModule: {}

  }
};


function _banner(type, text, width, endLine) {
  if (text.length > width) text = text.substring(0, width-3) + '...';
  var padLen = (width - (text.length)) / 2;
  var pad = []; for (var i = 0; i < padLen; i++) pad.push(' '); pad = pad.join('');
  switch (type) {
    case 'success':
    case 'green':
      return chalk.bgGreen.black(pad + text + pad) + endLine;
    case 'error':
    case 'red':
      return chalk.bgRed.black(pad + text + pad) + endLine;
    case 'warning':
    case 'yellow':
      return chalk.bgYellow.black(pad + text + pad) + endLine;
    case 'info':
    case 'cyan':
      return chalk.bgCyan.black(pad + text + pad) + endLine;
    case 'magenta':
      return chalk.bgMagenta.black(pad + text + pad) + endLine;
    case 'white':
      return chalk.bgWhite.black(pad + text + pad) + endLine;
    default :
      return pad + text + pad + endLine;
  }

}
function banner(type, text) {
  return _banner(type, text, 60, '\n');
}
function label(type, text) {
  if (!text) text = ' ';
  return _banner(type, text, 15, ' ');
}
function list(type, text) {
  if (!text) text = ' ';
  return _banner(type, text, 4, ' ');
}


module.exports = Messages;