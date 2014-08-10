/**
 * [Leaner.core.server.config] ExpressJS server configuration settings
 */

'use strict';

module.exports = {
  port: 3000,
  dirs: {
    public: __dirname + '/../client',
    views: __dirname + '/views',
    routes: __dirname + '/routes'
  },
  handlebars: {
    extname: 'hbs',
    defaultLayout: 'main.hbs',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
  }
};