/**
 * Angular app environment settings
 */
'use strict';

define({

  // root application name; all ng-modules for this app will be put underneath this namespace
  appName: '<%= ngAppName %>',

  // set base dir for app relative to root url
  baseAppDir: '/apps/<%= ngAppName %>/',

  // set base template/partials dir
  baseTemplateDir: '/apps/<%= ngAppName %>/partials/',

  // helper function to get full template path
  templatePath: function (view) { return [this.baseTemplateDir, view].join(''); }

});