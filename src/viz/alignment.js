var alignment = function() {
	// Import base chart
	var base = require('./base.js')();
	var utils = require('../utils.js');

	// Defaults
	var elemHeight = 4,
		orientation = 'down',
		events = [],
		tooltip;

	function chart(selection, options) {
		// Call base chart
		base.call(this, selection, options);

		// Grab base functions for easy access
		var x = base.x(),
			y = base.y(),
			id = base.id();
			xValue = base.xValue(),
			yValue = base.yValue(),			
			wValue = base.wValue();		

		// Change orientation of pileup
		if (orientation == 'down') {
			// swap y scale min and max
			y.range([y.range()[1],y.range()[0]]);
			// update y axis			
			selection.select(".iobio-y.iobio-axis").transition()
				.duration(0)
				.call(base.yAxis());
		}

		// Draw
		var g = selection.select('g.iobio-container').classed('iobio-alignment', true);; // grab container to draw into (created by base chart)		
		g.selectAll('.rect')
				.data(selection.datum())
			.enter().append('rect')
				.attr('class', 'rect')
				.attr('x', function(d) { return x(xValue(d)) })
				.attr('y', function(d) { return y(yValue(d)) - elemHeight + 2 })				
				.attr('id', function(d) { return id(d)})
				.attr('width', function(d) { 
					return x(xValue(d)+wValue(d)) - x(xValue(d));
				})
				.attr('height', function(d) { return elemHeight });

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
	// Rebind methods in 2d.js to this chart
	base.rebind(chart);

	/*
   	 * Specifies the orientation of the alignment. Can be 'up' or 'down'   
   	 */
  	chart.orientation = function(_) {
    	if (!arguments.length) return orientation;
    	orientation = _;
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
module.exports = alignment;