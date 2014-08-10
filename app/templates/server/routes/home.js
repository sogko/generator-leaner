/**
 * [Leaner.core.server.routes.defaultRoute] Default generated ExpressJS routes
 */

'use strict';

var _ = require('lodash');
var app = require('../app');
var express = require('express');
var router = express.Router({
  caseSensitive: app.get('case sensitive routing'),
  strict: app.get('strict routing')
});

router.get('/', function(req, res) {
  res.render('home');
});

router.get('/about', function(req, res) {
  res.render('about');
});

app.use('/', router);