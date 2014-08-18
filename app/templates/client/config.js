'use strict';

module.exports = {
  build: {

    baseDir: __dirname,
    destDir: 'dist/js',
    bundles: [
      {
        // common bundle
        name: 'common',
        require: [
          { type: 'bower', name: 'angular' },
          { type: 'bower', name: 'angular-ui-router' },
          { type: 'npm', name: 'lodash' }
        ]
      },
      {
        // concatenated bundle of all client apps
        name: 'apps.min',
        entries: 'client/apps/*/app.js',
        concat: true,
        external: ['common']
      },
      {
        // a bundle for each client app
        name: 'apps',
        entries: 'client/apps/*/app.js',
        concat: false,
        external: ['common']

      }
    ]
  }
};