var alignment = function() {
	// Import base chart
	var base = require('./base.js')(),
		utils = require('../utils.js'),
		extend = require('extend');

	// Value transformers
	var directionValue = null;

	// Defaults
	var elemHeight = 4,
		orientation = 'down',
		events = [],
		tooltip;

	// Default Options
	var defaults = { };

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
			yAxis = base.yAxis(),
			color = base.color(),
			transitionDuration = base.transitionDuration();

		// Change orientation of pileup
		if (orientation == 'down') {
			// swap y scale min and max
			y.range([y.range()[1],y.range()[0]]);
			// update y axis
			if(yAxis)
				selection.select(".iobio-y.iobio-axis").transition()
					.duration(0)
					.call(yAxis);
		}

		// Draw


		var g = selection.select('g.iobio-container').classed('iobio-alignment', true); // grab container to draw into (created by base chart)
		var aln = g.selectAll('.alignment')
				.data(selection.datum());

		// Enter
		aln.enter().append('g')
			.attr('class', 'alignment')
			.attr('transform', function(d) {
				var translate = 'translate('+parseInt(x(xValue(d) + wValue(d)/2))+','+ parseInt(y(yValue(d))-elemHeight/2) + ')'
				if (directionValue && directionValue(d) == 'reverse')
					return translate + ' rotate(180)';
				else
					return translate;
			})
			.append('polygon')
				.attr('id', function(d) { return id(d)})
				.style('fill', color)
				.attr('points', function(d) {
					var rW = x(xValue(d)+wValue(d)) - x(xValue(d));
					var rH = elemHeight;
					var arrW = Math.min(5, rW);

					if (directionValue) // draw arrow
						return ((-rW/2) + ',' + (-rH/2) + ' '
							  + (rW/2-arrW) + ',' + (-rH/2) + ' '
							  + (rW/2) + ',0 '
							  + (rW/2-arrW) + ',' + (rH/2) + ' '
							  + (-rW/2) + ',' + (rH/2));
					else // draw rectangle
						return ((-rW/2) + ',' + (-rH/2) + ' '
							  + (rW/2) + ',' + (-rH/2) + ' '
							  + (rW/2) + ',' + (rH/2) + ' '
							  + (-rW/2) + ',' + (rH/2));
				})

		aln.exit()

		aln.attr('transform', function(d) {
				var translate = 'translate('+parseInt(x(xValue(d) + wValue(d)/2))+','+ parseInt(y(yValue(d))-elemHeight/2) + ')'
				if (directionValue && directionValue(d) == 'reverse')
					return translate + ' rotate(180)';
				else
					return translate;
			})

		aln.select('polygon').transition()
			.duration(transitionDuration)
			.style('fill', color)
			.attr('points', function(d) {
				var rW = x(xValue(d)+wValue(d)) - x(xValue(d));
				var rH = elemHeight;
				var arrW = Math.min(5, rW);

				if (directionValue)
					return ((-rW/2) + ',' + (-rH/2) + ' '
						  + (rW/2-arrW) + ',' + (-rH/2) + ' '
						  + (rW/2) + ',0 '
						  + (rW/2-arrW) + ',' + (rH/2) + ' '
						  + (-rW/2) + ',' + (rH/2));
				else
					return ((-rW/2) + ',' + (-rH/2) + ' '
						  + (rW/2) + ',' + (-rH/2) + ' '
						  + (rW/2) + ',' + (rH/2) + ' '
						  + (-rW/2) + ',' + (rH/2));
			})

		// Add title on hover
	    if (tooltip) {
	    	var tt = d3.select('.iobio-tooltip')
	    	utils.tooltipHelper(g.selectAll('.alignment'), tt, tooltip);
	    }

	    // Attach events
		events.forEach(function(ev) {
			var cb = ev.listener ? function() {ev.listener.call(chart, svg)} : null;
			g.selectAll('.alignment').on(ev.event, cb);
		})

	}
	// Rebind methods in 2d.js to this chart
	base.rebind(chart);

	/*
	 * Value accessor for getting the direction of the alignment
	 */
	chart.directionValue = function(_) {
		if (!arguments.length) return directionValue;
		directionValue = _;
		return chart;
	};

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