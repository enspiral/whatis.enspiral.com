var bespoke = require('bespoke');

var classes = require('bespoke-classes');
var keys = require('bespoke-keys');
var touch = require('bespoke-touch');
var click = require('./click');
var backdrop = require('bespoke-backdrop');
var scale = require('bespoke-scale');
var hash = require('bespoke-hash');
var progress = require('bespoke-progress');

//var highres = require('./highres');

module.exports = bespoke.from('#slides', [
  classes(),
  keys(),
  touch(),
  click(),
  backdrop(),
  scale(),
  hash(),
  progress(),
  //highres(),
])
;

// hack to get scale transform to work
(function fireResize () {
  var evt = document.createEvent('UIEvents');
  evt.initUIEvent('resize', true, false, window, 0);
  window.dispatchEvent(evt);
})();
