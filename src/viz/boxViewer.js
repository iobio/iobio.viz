var boxViewer = function() {
	// Import base chart
	var box = require('./box.js'),
		utils = require('../utils.js'),
		extend = require('extend');

	// Defaults
	var events = [],
		tooltip,
		sizeRatio = 0.8,
		origHeight,
		exitDuration = 0;

	// Default Options
	var defaults = { };

	// Base Chart
	var basebox = box();

	function chart(selection, opts) {
		// Merge defaults and options
		var options = {};
		extend(options, defaults, opts);

		// Set Height
		origHeight = chart.height();

		// Setup both chart divs
		selection.selectAll('div')
				.data([0,0])
			.enter().append('div')
				.attr('class', function(d,i) { return 'iobio-box-' + i + ' iobio-boxViewer' });

		// Call big box chart
		var focalbox = box()
			.height( origHeight * sizeRatio )
			.xValue( chart.xValue() )
			.yValue( chart.yValue() )
			.wValue( chart.wValue() )
			.xAxis( chart.xAxis() )
			.yAxis( chart.yAxis() )
			.whiskersValue( chart.whiskersValue() )
			.quartilesValue( chart.quartilesValue() )
			.outerPadding( chart.outerPadding() )
			.padding( chart.padding() )
			.whiskerType( chart.whiskerType() )
			.class( chart.class() )
			.margin( chart.margin() )
			.width( chart.width() )
			.y( chart.y() )
			.x( chart.x() )
			.id( chart.id() )
			.keyValue( chart.keyValue() )
			.color( chart.color() )
			.tooltip( chart.tooltip() )
			.transitionDuration( chart.transitionDuration() )

		var focalSelection = selection.select('.iobio-box-0').datum( selection.datum() )
		focalbox(focalSelection, options);

		// Call little box chart
		var globalbox = box()
			.xValue( chart.xValue() )
			.yValue( chart.yValue() )
			.wValue( chart.wValue() )
			.xAxis( chart.xAxis() )
			.yAxis( null )
			.whiskersValue( chart.whiskersValue() )
			.quartilesValue( chart.quartilesValue() )
			.outerPadding( chart.outerPadding() )
			.padding( chart.padding() )
			.whiskerType( chart.whiskerType() )
			.class( chart.class() )
			.margin( chart.margin() )
			.width( chart.width() )
			.transitionDuration( chart.transitionDuration() )
			.id( chart.id() )
			.keyValue( chart.keyValue() )
			.color( chart.color() )
			.tooltip( chart.tooltip() )
			.height( origHeight * (1-sizeRatio) )
			.brush('brush', function() {
				var x2 = globalbox.x(), brush = globalbox.brush();
	        	var x = brush.empty() ? x2.domain() : brush.extent();
	        	var datum = globalSelection.datum().filter(function(d,i) {
	        		return (globalbox.xValue()(d,i) >= x[0] && globalbox.xValue()(d,i) <= x[1])
	        	});

	        	//  Delay exit when sliding brush window
	        	// if (brush.empty())
	        	// 	focalbox.exitTransitionDuration(0)
	        	// else
	        	// 	focalbox.exitTransitionDuration( focalbox.transitionDuration() )

	        	// Draw
	        	options.xMin = x[0];
	        	options.xMax = x[1];
	        	options.globalbox = globalbox;
	           	focalbox( focalSelection.datum(datum), options );
			});

		var globalSelection = selection.select('.iobio-box-1').datum( selection.datum() )
		globalbox(globalSelection, options);

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
		// focalbox.rebind(this);
	}

	// Rebind methods in box chart to this chart
	basebox.rebind(chart);

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
module.exports = boxViewer;