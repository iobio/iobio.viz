var scatter = function() {
	// Import base chart
	var base = require('./base.js')(),
		utils = require('../utils.js'),
		extend = require('extend');

	// Defaults
	var events = [],
		tooltip,
		keyValue,
		klass = '',
		symbol = 'x';

	// Default Options
	var defaults = { yMin: 0 };

	function chart(selection, opts) {
		// Merge defaults and options
		var options = {};
		extend(options, defaults, opts);

		// Call base chart
		base.call(this, selection, options);

		// Grab base functions for easy access
		var y = base.y(),
			x = base.x(),
			id = base.id(),
			xValue = base.xValue(),
			yValue = base.yValue(),
			wValue = base.wValue(),
			keyValue = base.keyValue(),
			color = base.color(),
			transitionDuration = base.transitionDuration(),
			innerHeight = base.height() - base.margin().top - base.margin().bottom;

		if (innerHeight < 0) {
			console.log("Negative inner height " + innerHeight + " calculated for scatter chart. Change height or margins.");
			console.trace();
			return;
		}

		// Draw
		// enter
		var g = selection.select('g.iobio-container').classed('iobio-scatter', true);; // grab container to draw into (created by base chart)
		var dot = g.selectAll('.dot')
				.data(selection.datum(), keyValue )
		// exit
	    dot.exit().remove();

	    if (symbol == 'circle') {
			// enter
			dot.enter().append('g')
				.attr('id', id )
				.style('fill', color )
				.append('circle')
					.attr('cy', function(d,i) { return y(yValue(d,i)) })
					.attr('cx', function(d,i) { return x(xValue(d,i)) })
					.attr('r', function(d,i) { return 0 });

			// update
			dot
				.attr('class', function(d,i) { return 'dot ' + utils.value_accessor(klass,d,i) })
				.style('fill', color )
				.select('circle').transition()
					.duration( transitionDuration )
					.attr('cx', function(d,i) { return x(xValue(d,i)) })
					.attr('cy', function(d,i) { return y(yValue(d,i)) })
					.attr('r', function(d,i) { return (x(xValue(d,i)+wValue(d,i)) - x(xValue(d,i)))/2; });
		} else if (symbol == "x") {
			// enter
			dot.enter().append('g')
				.attr('id', id )
				.attr('class', 'dot')
				.style('fill', color )
				.style('font-size', '0.1')
					.append('text')
					.attr('x', function(d,i) { return x(xValue(d,i)) })
					.attr('y', function(d,i) { return y(yValue(d,i)) })
					.attr('text-anchor', 'middle')
					.attr('alignment-baseline', 'middle')
					.text('x');

			// update
			dot.attr('class', function(d,i) { return 'dot ' + utils.value_accessor(klass,d,i) })
				.transition()
				.duration( transitionDuration )
				.style('fill', color )
				.style('font-size', function(d,i) { return x(xValue(d,i)+wValue(d,i)) - x(xValue(d,i)); })
					.select('text')
						.attr('x', function(d,i) { return x(xValue(d,i)) })
						.attr('y', function(d,i) { return y(yValue(d,i)) })
						.text('x');
		}


		// Add title on hover
	    if (tooltip) {
	    	var tt = d3.select('.iobio-tooltip')
	    	utils.tooltipHelper(g.selectAll('.dot'), tt, tooltip);
	    }

	    // Attach events
		events.forEach(function(ev) {
			dot.on(ev.event, ev.listener);
		})

	}
	// Rebind methods in base.js to this chart
	base.rebind(chart);

	/*
   	 * Set events on dots
   	 */
	chart.on = function(event, listener) {
		if (!arguments.length) return events;
		events.push( {'event':event, 'listener':listener})
		return chart;
	}

	/*
   	 * Set tooltip that appears when mouseover dots
   	 */
	chart.tooltip = function(_) {
		if (!arguments.length) return tooltip;
			tooltip = _;
			return chart;
	}

	/*
   	 * Set class on the g element of each symbol
   	 */
	chart.class = function(_) {
		if (!arguments.length) return klass;
			klass= _;
		return chart;
	}

	/*
   	 * Set type of symbol to draw
   	 */
	chart.symbol = function(_) {
		if (!arguments.length) return symbol;
			symbol = _;
			return chart;
	}

	/*
   	 * Easy method to rebind scatter chart functions to the argument chart
   	 */
	chart.rebind = function(object) {
		base.rebind(object);
		utils.rebind(object, this, 'rebind', 'class', 'symbol');
	}

	return chart;
}

// Export alignment
module.exports = scatter;