/**
 * [Leaner.core.server.app] ExpressJS application entry-point
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config');
var _ = require('lodash');
var dir = require('node-dir');

// require main expressjs and export app
var express = require('express');
var app = module.exports = express();

// require middlewares
var handlebars = require('express-handlebars');
var busboy = require('connect-busboy');
var parseQueryJSON = require('./middlewares/parse-query-json');

// Note: This stack leaves database choice open to you (mongodb, arangodb, sqlite etc)
// Create connection to your favourite database (or databases!) here

// set default template engine to handlebars
app.engine('hbs', handlebars(config.handlebars));
app.set('view engine', 'hbs');
app.set('views', config.dirs.views);

// set routing settings
app.set('case sensitive routing', true);
app.set('strict routing', true);

// parse query string as json
app.use(parseQueryJSON());

// streaming parser for HTML form data
app.use(busboy());

// auto-load routing files in 'routes' folder
dir.files(config.dirs.routes, function (err, files) {
  _.forEach(files, function (f) { require(f); });
});

// setup public static directory
app.use(express.static(config.dirs.public));

// start HTTP server
app.listen(config.port);

