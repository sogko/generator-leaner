/**
 * [Leaner.core.server.middlewares.sampleMiddleware] A sample (but useful!) ExpressJS middleware included to
 * suggest possible server files organization
 *
 * Parse query string as JSON object using 'qs' module and make it available in req.query
 */
'use strict';

var url = require('url');
var qs = require('querystring');

module.exports = function parseQueryJSON() {
  return function(req, res, next){
    var parsedUrl = url.parse(req.url);
    req.query = qs.parse(parsedUrl.query);
    next();
  };
};