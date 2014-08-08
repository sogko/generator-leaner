var chalk = require('chalk');

var TERMINAL_MAX_WIDTH = 80;

function code(lines) {
  var width = TERMINAL_MAX_WIDTH;
  var padChar = ' ';
  var str = [];
  for (var i = 0; i < lines.length; i++) {
    lines[i] = padChar + padChar + lines[i];
    if (lines[i].length % 2 !== 0) lines[i] = lines[i] + padChar;
    var padLen = width - lines[i].length;
    if (padLen < 0) padLen = 0;
    for (var k = 0; k < padLen; k++) lines[i] = lines[i] + padChar;

    str.push(chalk.bgWhite.gray(lines[i]));
  }
  return str.join('\n')
}

function _center(type, text, width, endLine, padChar) {
  if (text.length > width) text = text.substring(0, width - 3) + '...';
  if (text.length % 2 !== 0) text = text + ' ';
  var padLen = (width - (text.length)) / 2;
  if (!padChar) padChar = ' ';
  var pad = [];
  for (var i = 0; i < padLen; i++) pad.push(padChar);
  pad = pad.join('');
  switch (type) {
    case 'success':
    case 'green':
      return chalk.bgGreen.black(pad + text + pad) + endLine;
    case 'error':
    case 'red':
      return chalk.bgRed.white.bold(pad + text + pad) + endLine;
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
  return _center(type, text, TERMINAL_MAX_WIDTH, '\n');
}
function label(type, text) {
  if (!text) text = ' ';
  return _center(type, text, 15, ' ');
}
function list(type, text) {
  if (!text) text = ' ';
  return _center(type, text, 4, ' ');
}
function rule(text) {
  return _center('white', text, TERMINAL_MAX_WIDTH, '\n', '-');
}

module.exports = {
  code: code,
  banner: banner,
  label: label,
  list: list,
  rule: rule
};