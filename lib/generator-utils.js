var path = require('path');
var util = require('util');

// define static methods
var Utils = {

};

// define c'tor, extended with static methods
Utils = util._extend(function (generator) {

  return {
    copyTemplateDirectory: function copyTemplateDirectory(source, destination) {

      var root = generator.isPathAbsolute(source) ? source : path.join(generator.sourceRoot(), source);
      var files = generator.expandFiles('**', { dot: true, cwd: root });

      for (var i = 0; i < files.length; i++) {
        var f = files[i];
        var src = path.join(root, f);
        if (path.basename(f).indexOf('_') == 0) {
          var dest = path.join(destination, path.dirname(f), path.basename(f).replace(/^_/, ''));
          generator.template(src, dest);
        } else {
          var dest = path.join(destination, f);
          generator.copy(src, dest);
        }
      }
    },

    askFor: function askFor(generator) {

      var done = generator.async();

      var prompts = [
        {
          type: 'confirm',
          name: 'someOption',
          message: 'Would you like to enable this option?',
          default: true
        }
      ];

      generator.prompt(prompts, function (props) {
        generator.someOption = props.someOption;
        done();
      });

    }
  };
}, Utils);


module.exports = Utils;