var referenceGraph = function() {
	var graph = require('../layout/graph.js')();
	var diagonal = d3.svg.diagonal()
    	.projection(function(d) { return [d.y, d.x]; });
    var utils = require('../utils.js')

	// Import twod base chart
	var twod = require('./twod.js')();

	// Defaults
	var elemHeight = 10,
		orientation = 'down',
		levelHeight = 50,
		events = [],
		tooltip,
		variant = iobio.viz.svg.variant();

	// Remove y axis
	twod.yAxis(null);

	function chart(selection, options) {		
		// Call base chart
		twod.call(this, selection, options);

		// Grab twod functions for easy access
		var x = twod.x(),
			y = twod.y().domain([-1,1]),
			id = twod.id(),
			xValue = twod.xValue(),
			yValue = twod.yValue(),			
			wValue = twod.wValue();

		// Set variant accessors
		variant
			.xValue(function(d) { return x(+xValue(d)); })
			.wValue(function(d) { return x(xValue(d)+wValue(d)) - x(+xValue(d)); })			
			.yValue(function(d) { return yValue(d)>0 ? y(0)+elemHeight : y(0); })			
			.hValue(function(d) { return levelHeight * yValue(d); });

		// Draw nodes
		var g = selection.select('g.container'); // grab container to draw into (created by base chart)
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
	    	var div = d3.select('.iobio-tooltip')	    	
	    	g.selectAll('.node')
		    	.on("mouseover", function(d,i) {
		    		var tooltipStr = utils.value_accessor(tooltip, d); // handle both function and constant string
					div.transition()        
						.duration(200)      
						.style("opacity", .9);      
					div.html(tooltipStr)
						.style("left", (d3.event.pageX) + "px") 
						.style("text-align", 'left')
						.style("top", (d3.event.pageY - 24) + "px");    
				})
				.on("mouseout", function(d) {       
					div.transition()        
						.duration(500)      
						.style("opacity", 0);   
				})
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
	twod.rebind(chart);

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