var bar = function() {
	// Import base chart
	var base = require('./base.js')(),
		utils = require('../utils.js'),
		extend = require('extend');

	// Defaults
	var events = [],
		tooltip,
		keyValue;

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
			id = base.id(),
			xValue = base.xValue(),
			yValue = base.yValue(),
			wValue = base.wValue(),
			keyValue = base.keyValue(),
			color = base.color(),
			transitionDuration = base.transitionDuration(),
			innerHeight = base.height() - base.margin().top - base.margin().bottom;

		if (innerHeight < 0) {
			console.log("Negative inner height " + innerHeight + " calculated for bar chart. Change height or margins.");
			console.trace();
			return;
		}

		// Draw
		// enter
		var g = selection.select('g.iobio-container').classed('iobio-bar', true);; // grab container to draw into (created by base chart)
		var rect = g.selectAll('.rect')
				.data(selection.datum(), keyValue )
		// exit
	    rect.exit().remove();

		// enter
		rect.enter().append('g')
			.attr('id', id )
			.attr('class', 'rect')
			.style('fill', color )
			.append('rect')
				.attr('y', function(d) { return innerHeight })
				.attr('x', function(d,i) { return x(xValue(d,i)) })
				.attr('width', function(d,i) { return x(xValue(d,i)+wValue(d,i)) - x(xValue(d,i));})
				.attr('height', function(d) { return 0; });

		// update
		rect
			.style('fill', color )
			.select('rect').transition()
				.duration( transitionDuration )
				.attr('x', function(d,i) { return x(xValue(d,i)) })
				.attr('y', function(d,i) { return y(yValue(d,i)) })
				.attr('width', function(d,i) { return x(xValue(d,i)+wValue(d,i)) - x(xValue(d,i));})
				.attr('height', function(d,i) { return innerHeight - y(yValue(d,i)); });


		// Add title on hover
	    if (tooltip) {
	    	var tt = d3.select('.iobio-tooltip')
	    	utils.tooltipHelper(g.selectAll('.rect'), tt, tooltip);
	    }

	    // Attach events
		events.forEach(function(ev) {
			rect.on(ev.event, ev.listener);
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

	/*
   	 * Easy method to rebind bar chart functions to the argument chart
   	 */
	chart.rebind = function(object) {
		base.rebind(object);
		utils.rebind(object, this, 'rebind');
	}

	return chart;
}

// Export alignment
module.exports = bar;