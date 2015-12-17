var bar = function() {
	// Import base chart
	var base = require('./base.js')(),
		utils = require('../utils.js'),
		extend = require('extend');

	// Defaults
	var events = [],
		tooltip;

	// Default Options
	var defaults = { yMin: 0 };

	function chart(selection, opts) {
		// Merge defaults and options
		var options = {};
		extend(options, defaults, opts);

		// Call base chart
		base.call(this, selection, options);

		// Grab base functions for easy access
		var x = base.x(),
			y = base.y(),
			id = base.id();
			xValue = base.xValue(),
			yValue = base.yValue(),			
			wValue = base.wValue(),
			color = base.color(),
			transitionDuration = base.transitionDuration(),
			innerHeight = base.height() - base.margin().top - base.margin().bottom;		

		// Draw
		// enter
		var g = selection.select('g.iobio-container').classed('iobio-bar', true);; // grab container to draw into (created by base chart)		
		var gData = g.selectAll('.rect')
				.data(selection.datum(), function(d) { return xValue(d); })
		// exit
	    gData.exit().remove();
			
		// enter
		gData.enter().append('g')				
			.attr('class', 'rect')			
			.style('fill', color )
			.append('rect')					
				.attr('y', function(d) { return innerHeight })
				.attr('x', function(d) { return x(xValue(d)) })
				.attr('id', id )				
				.attr('width', function(d) { return x(xValue(d)+wValue(d)) - x(xValue(d));})				
				.attr('height', function(d) { return 0; });

		// update
		g.selectAll('.rect').select('rect').transition()
			.duration( transitionDuration )	
			.attr('x', function(d) { return x(xValue(d)) })		
			.attr('y', function(d) { return y(yValue(d)) })
			.attr('width', function(d) { return x(xValue(d)+wValue(d)) - x(xValue(d));})									
			.attr('height', function(d) { return innerHeight - y(yValue(d)); });
	    

		// Add title on hover	   
	    if (tooltip) {	 
	    	var tt = d3.select('.iobio-tooltip')   	
	    	utils.tooltipHelper(g.selectAll('.rect'), tt, tooltip);
	    }

	    // Attach events
		events.forEach(function(ev) {
			var cb = ev.listener ? function() {ev.listener.call(chart, svg)} : null;
			g.selectAll('.rect').on(ev.event, cb);			
		})	

	}
	// Rebind methods in base.js to this chart
	base.rebind(chart);

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
module.exports = bar;