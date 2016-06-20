var barViewer = function() {
	// Import base chart
	var bar = require('./bar.js'),
		utils = require('../utils.js'),
		extend = require('extend');

	// Defaults
	var events = [],
		tooltip,
		sizeRatio = 0.8,
		origHeight;

	// Default Options
	var defaults = { };

	// Base Chart
	var baseBar = bar();

	function chart(selection, opts) {
		// Merge defaults and options
		var options = {};
		extend(options, defaults, opts);

		origHeight = chart.height();

		// Setup both chart divs
		selection.selectAll('div')
				.data([0,0])
			.enter().append('div')
				.attr('class', function(d,i) { return 'iobio-bar-' + i + ' iobio-barViewer' });

		// Call big bar chart
		var focalBar = bar()
			.height( origHeight * sizeRatio )
			.xValue( chart.xValue() )
			.yValue( chart.yValue() )
			.wValue( chart.wValue() )
			.xAxis( chart.xAxis() )
			.yAxis( chart.yAxis() )
			.margin( chart.margin() )
			.width( chart.width() )
			.y( chart.y() )
			.x( chart.x() )
			.id( chart.id() )
			.color( chart.color() )
			.tooltip( chart.tooltip() )
			.transitionDuration( chart.transitionDuration() )

		var focalSelection = selection.select('.iobio-bar-0').datum( selection.datum() )
		focalBar(focalSelection, options);

		// Call little bar chart
		var globalBar = bar()
			.xValue( chart.xValue() )
			.yValue( chart.yValue() )
			.wValue( chart.wValue() )
			.xAxis( chart.xAxis() )
			.yAxis( null )
			.margin( chart.margin() )
			.width( chart.width() )
			.transitionDuration( chart.transitionDuration() )
			.id( chart.id() )
			.color( chart.color() )
			.tooltip( chart.tooltip() )
			.height( origHeight * (1-sizeRatio) )
			.brush('brush', function() {
				var x2 = globalBar.x(), brush = globalBar.brush();
	        	var x = brush.empty() ? x2.domain() : brush.extent();
	        	var datum = globalSelection.datum().filter(function(d) {
	        		return (globalBar.xValue()(d) >= x[0] && globalBar.xValue()(d) <= x[1])
	        	});
	        	options.xMin = x[0];
	        	options.xMax = x[1];
	        	options.globalBar = globalBar;
	           	focalBar( focalSelection.datum(datum), options );
			});

		var globalSelection = selection.select('.iobio-bar-1').datum( selection.datum() )
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
		// focalBar.rebind(this);
	}

	// Rebind methods in bar chart to this chart
	baseBar.rebind(chart);

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