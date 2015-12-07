var referenceGraph = function() {
	var graph = require('../layout/graph.js')();
	var diagonal = d3.svg.diagonal()
    	.projection(function(d) { return [d.y, d.x]; });
    var utils = require('../utils.js')

	// Import base chart
	var base = require('./base.js')();

	// Defaults
	var elemHeight = 10,
		orientation = 'down',
		levelHeight = 50,
		events = [],
		tooltip,
		variant = iobio.viz.svg.variant();

	// Remove y axis
	base.yAxis(null);

	function chart(selection, options) {		
		// Call base chart
		base.call(this, selection, options);

		// Grab base functions for easy access
		var x = base.x(),
			y = base.y().domain([-1,1]),
			id = base.id(),
			xValue = base.xValue(),
			yValue = base.yValue(),			
			wValue = base.wValue();

		// Set variant accessors
		variant
			.xValue(function(d) { return x(+xValue(d)); })
			.wValue(function(d) { return x(xValue(d)+wValue(d)) - x(+xValue(d)); })			
			.yValue(function(d) { return yValue(d)>0 ? y(0)+elemHeight : y(0); })			
			.hValue(function(d) { return levelHeight * yValue(d); });

		// Draw nodes
		var g = selection.select('g.iobio-container').classed('iobio-referenceGraph', true);; // grab container to draw into (created by base chart)
		var gEnter = g.selectAll('g.node')
				.data(selection.datum(), function(d) { return d.id ; })
			.enter().append('svg:g')
				.attr('class', 'node')				
		
		// Draw line
		selection.selectAll('g.node')
			.filter(function(d){ return yValue(d) == 0 })
			.append("svg:rect")			
				.attr('id', function(d) { return id(d)})	
				.attr('x', function(d) { return x(+xValue(d)); })	
				.attr('y', function(d) { return y(+yValue(d)); })			
				.attr('width', function(d) { return x(xValue(d)+wValue(d)) - x(+xValue(d));})
				.attr('height', function(d) { return elemHeight })
				.attr('class', function(d) {
					var step = +yValue(d);
					if (step == 0) return 'reference'; 
					else  if (step > 0) return 'below-variant';
					else return 'above-variant';
				});

		// Draw Variants
		selection.selectAll('g.node')
			.filter(function(d){ return yValue(d) != 0 })
			.append("svg:path")			
				.attr('id', function(d) { return id(d)})
				.attr('d', variant)
				.attr('class', function(d) {
					var step = +yValue(d);
					if (step == 0) return 'reference'; 
					else  if (step > 0) return 'below-variant';
					else return 'above-variant';
				});

		// Add title on hover
	    if (tooltip) {	 
	    	var tt = d3.select('.iobio-tooltip')   	
	    	utils.tooltipHelper(g.selectAll('.node'), tt, tooltip);
	    }

	    // Add events
		if (events.length > 0) {
			var rect = g.selectAll('.node');
			events.forEach(function(event) {
				rect.on(event.type, event.action)
			})
		}
	}
	// Rebind methods in 2d.js to this chart
	base.rebind(chart);

	/*
   	 * Set events on variants
   	 */
	chart.on = function(type, action) {
		events.push( {'type':type, 'action':action})
		return chart;
	}

	/*
   	 * Set height of variant levels
   	 */
	chart.levelHeight = function(_) {
		if (!arguments.length) return levelHeight;
		levelHeight = _;
		return chart; 
	}

	/*
   	 * Set drawing function for variants. Function must have the following 
   	 * accessor functions:
   	 * xValue, yValue, wValue, hValue
   	 */
	chart.variant = function(_) {
		if (!arguments.length) return variant;
		variant = _;
		return chart; 
	}

	/*
   	 * Set tooltip that appears when mouseover variants
   	 */
	chart.tooltip = function(_) {
		if (!arguments.length) return tooltip;
			tooltip = _;
			return chart; 
	}

	return chart;
}

// Export referenceGraph
module.exports = referenceGraph;