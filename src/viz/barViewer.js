var barViewer = function() {
	// Import base chart
	var base = require('./base.js')(),
		bar = require('./bar.js'),
		utils = require('../utils.js'),
		extend = require('extend');

	// Defaults
	var events = [],
		tooltip,
		sizeRatio = 0.8;

	// Default Options
	var defaults = { };

	function chart(selection, opts) {
		// Merge defaults and options
		var options = {};
		extend(options, defaults, opts);

		// // Call base chart		
		// base.call(this, selection, options);

		selection.selectAll('div')
				.data([0,0])
			.enter().append('div')
				.attr('id', function(d,i) { return 'iobio-bar-' + i });
		
		// Call big bar chart
		var focalBar = bar()
			.height( base.height() * sizeRatio );
		var focalSelection = d3.select('#iobio-bar-0').datum( selection.datum() )
		focalBar(focalSelection, options);

		// Call little bar chart
		var globalBar = bar()
			.height( base.height() * (1-sizeRatio) )
			.yAxis( null )
			.brush('brush', function() { 
				var x2 = globalBar.x(), brush = globalBar.brush();
	        	var x = brush.empty() ? x2.domain() : brush.extent();
	        	var datum = globalSelection.datum().filter(function(d) { return (d[0] >= x[0] && d[0] <= x[1]) });
	           	focalBar( focalSelection.datum(datum), options );
			});

		var globalSelection = d3.select('#iobio-bar-1').datum( selection.datum() )
		globalBar(globalSelection, options);

		// // Add title on hover	   
	 //    if (tooltip) {	 
	 //    	var tt = d3.select('.iobio-tooltip')   	
	 //    	utils.tooltipHelper(g.selectAll('.rect'), tt, tooltip);
	 //    }

	 //    // Attach events
		// events.forEach(function(ev) {
		// 	var cb = ev.listener ? function() {ev.listener.call(chart, svg)} : null;
		// 	g.selectAll('.rect').on(ev.event, cb);			
		// })	

	}
	// Rebind methods in base.js to this chart
	base.rebind(chart);

	/*
   	 * Set events on rects
   	 */
	chart.sizeRatio = function(_) {
		if (!arguments.length) return sizeRatio;
		sizeRatio = _;
		return chart; 
	};

	/*
   	 * Set events on rects
   	 */
	chart.on = function(event, listener) {
		if (!arguments.length) return events;
		events.push( {'event':event, 'listener':listener})
		return chart;
	}

	/*
   	 * Set tooltip that appears when mouseover rects
   	 */
	chart.tooltip = function(_) {
		if (!arguments.length) return tooltip;
		tooltip = _;
		return chart; 
	}

	return chart;
}

// Export alignment
module.exports = barViewer;