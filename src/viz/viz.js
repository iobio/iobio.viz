
var viz = {};
// add visualizations
viz.base = require('./base.js')
viz.pie = require('./pie.js')
viz.pieChooser = require('./pieChooser.js')
viz.alignment = require('./alignment.js')
viz.line = require('./line.js')
viz.bar = require('./bar.js')
viz.barViewer = require('./barViewer.js')
viz.gene = require('./gene.js')
viz.multiLine = require('./multiLine.js')
viz.box = require('./box.js')
viz.boxViewer = require('./boxViewer.js')
viz.scatter = require('./scatter.js')
viz.scatterViewer = require('./scatterViewer.js')

module.exports = viz;