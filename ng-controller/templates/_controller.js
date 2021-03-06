/**
 * <%= ngControllerFullName %> component definition
 */

'use strict';

var controllers = require('../controllers');

controllers.controller('<%= ngControllerName %>', function ($scope) {
  <% if (includeSample) { %>
  // A sample controller implementation to show greetings randomly from a list
  $scope.greetings = [
    '¡Hola Mundo!', 'مرحبا العالم!', 'Kamusta sa Lahat!', 'העלא וועלט!', 'Hallo Welt!',
    'ハローワールド！', '안녕하세요!', '你好世界！', 'Hej världen!', 'Olá Mundo!',
    'नमस्ते विश्व!', 'Bonjour le monde!', 'Ciao mondo!', 'Hej Verden!', 'Привет мир!'
  ][(Math.floor(Math.random() * 15))];
  <% } else { %>
  // <%= ngControllerName %> controller logic here
  // ...
  <% } %>

});
module.exports = controllers;

console.log('Loaded <%= ngAppName %>/controllers/index.js');
