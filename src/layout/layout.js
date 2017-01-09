
var layout = {};
// add layouts
layout.pileup = require('./pileup.js');
layout.graph = require('./graph.js');
layout.pointSmooth = require('./pointSmooth.js');
layout.outlier = require('./outlier.js');
layout.box = require('./box.js');

module.exports = layout;