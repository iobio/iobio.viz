// Grab an existing iobio namespace object, or create a blank object
// if it doesn't exist
var iobio = global.iobio || {};
global.iobio = iobio;

// export if being used as a node module - needed for test framework
if ( typeof module === 'object' ) { module.exports = iobio;}

// Create Base Object
iobio.viz = {};

// Add visualizations
iobio.viz.twod = require('./viz/twod.js')
iobio.viz.circle = require('./viz/circle.js')
iobio.viz.alignment = require('./viz/alignment.js')
iobio.viz.referenceGraph = require('./viz/referenceGraph.js')

// Add layouts
iobio.viz.layout = require('./layout/layout.js')

// Add shapes
iobio.viz.svg = require('./svg/svg.js')

// Add utils
iobio.viz.utils = require('./utils.js')
