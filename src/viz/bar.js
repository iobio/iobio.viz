import * as d3 from 'd3';
import baseModule from './base.js';
import utils from '../utils.js';

var bar = function() {
	// Import base chart
  const base = baseModule();

	// Defaults
	var events = [],
		tooltip,
		keyValue;

	// Default Options
	var defaults = { yMin: 0 };

	function chart(selection, opts) {
		// Merge defaults and options
		var options = {};
		Object.assign(options, defaults, opts);

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
		var rectUpdate = g.selectAll('.rect')
				.data(selection.datum(), keyValue )
		// exit
	    rectUpdate.exit().remove();

    var rectEnter = rectUpdate.enter().append('g')
			.attr('id', id )
			.attr('class', 'rect');

    var rect = rectEnter.merge(rectUpdate);

		// enter
    rectEnter.append('rect')
        .attr('class', 'iobio-data')
				.attr('y', function(d) { return innerHeight })
				.attr('x', function(d,i) { return x(xValue(d,i)) })
				.attr('width', function(d,i) { return x(xValue(d,i)+wValue(d,i)) - x(xValue(d,i));})
				.attr('height', function(d) { return 0; });

		// update
		rect
			.select('rect').transition()
				.duration( transitionDuration )
				.attr('x', function(d,i) {
          const val = x(xValue(d,i));
          return val;
        })
				.attr('y', function(d,i) { return y(yValue(d,i)) })
				.attr('width', function(d,i) { return x(xValue(d,i)+wValue(d,i)) - x(xValue(d,i));})
				.attr('height', function(d,i) { return innerHeight - y(yValue(d,i)); });


		// Add title on hover
	    if (tooltip) {
	    	var tt = selection.select('.iobio-tooltip')
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

export default bar;
