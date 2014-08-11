'use strict';

var app = require('../app');
var express = require('express');
var router = express.Router({
  caseSensitive: app.get('case sensitive routing'),
  strict: app.get('strict routing')
});

// ensure that the endpoint serving the app always have a trailing slash
// so we can have a nice url structure for our angular app
// eg: http://localhost:3000/<%= ngAppName %>/#/home
app.all('/<%= ngAppName %>', function(req, res) { res.redirect('/<%= ngAppName %>/'); });

router.get('/', function(req, res) {
  res.render('<%= ngAppName %>/home');
});

app.use('/<%= ngAppName %>/', router);
