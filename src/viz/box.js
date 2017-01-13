var box = function() {
	// Import base chart
	var base = require('./base.js')(),
		utils = require('../utils.js'),
		extend = require('extend');

	// Defaults
	var events = [],
		tooltip,
		padding = 0.1,
		outerPadding = 0,
		whiskersValue = function(d,i) { return d.whiskers; },
		quartilesValue = function(d,i) { return d.quartiles; },
		whiskerType = 'line',
		exitTransitionDuration = 0,
		klass = '',
		x = d3.scale.ordinal();

	// Base chart changes
	base.xValue(function(d,i){ return i; })

	// Default Options
	var defaults = {};

	function chart(selection, opts) {
		// Merge defaults and options
		var options = {};
		extend(options, defaults, opts);

		options.yMin = options.yMin==undefined ? d3.min(selection.datum(), function(d) { return +whiskersValue(d)[1]; }) : options.yMin;
		options.yMax = options.yMax==undefined ? d3.max(selection.datum(), function(d) { return +whiskersValue(d)[0]; }) : options.yMax;
		// var max =
		// 	var min =

		// Call base chart
		base.wValue(function() { return 1; })
			.call(this, selection, options);

		// Grab base functions for easy access
		var y = base.y(),
			id = base.id(),
			xValue = base.xValue(),
			yValue = base.yValue(),
			wValue = base.wValue(),
			keyValue = base.keyValue(),
			tt = d3.select('.iobio-tooltip'),
			color = base.color(),
			transitionDuration = base.transitionDuration(),
			innerWidth = base.width() - base.margin().left - base.margin().right;

		// Alter scales to work for boxplots
		x.rangeBands([0,innerWidth], padding, outerPadding).domain( selection.datum().map(function(d,i) { return i } ) );
		var boxWidth = x.rangeBand();

		// Draw
		var g = selection.select('g.iobio-container').classed('iobio-box', true);; // grab container to draw into (created by base chart)

		// g box container
		var box = g.selectAll('.box')
			.data(selection.datum(), keyValue)

		// enter
		box.enter().append('g')
			.attr('id', id )
			.style('fill', color )
			.attr('transform', function(d,i){return "translate(" + x(xValue(d,i)) + ", 0)";});
		// exit
	    box.exit().transition().duration(exitTransitionDuration).remove();
		// update
		box.attr('class', function(d,i) { return 'box ' + utils.value_accessor(klass,d,i) })
		box.transition()
			.duration(transitionDuration)
			.attr('transform', function(d,i){return "translate(" + x(xValue(d,i)) + ", 0)";})
			.attr('data-median', function(d) {
				return quartilesValue(d)[1]
			});

		// center line
		var center = box.selectAll('.center').data(function(d) {return [whiskersValue(d)];})
		// enter
		center.enter().insert("line", "rect")
				.attr("class", "center")
				.attr("x1", boxWidth / 2)
				.attr("y1", function(d) { return y(d[0]); })
				.attr("x2", boxWidth / 2)
				.attr("y2", function(d) { return y(d[1]); })
				.style('opacity', 0);
		//exit
		center.exit().remove();
		// update
		center.transition()
			.duration(transitionDuration)
			.attr("y1", function(d) { return y(d[0]); })
			.attr("y2", function(d) { return y(d[1]); })
			.style('opacity', 1);

		// rect
		var rect = box.selectAll('.rect').data(function(d) {return [quartilesValue(d)];});
		// enter
		rect.enter().append('rect')
				.attr('class', 'rect')
				.attr('y', function(d) {return y(d[0])})
				.attr('x', function(d,i) { return boxWidth/2 })
				.attr('width', function(d,i) { return 0 })
				.attr('height', function(d) { return y(d[2]) - y(d[0]) });
		// exit
		rect.exit().remove()
		// update
		rect.transition()
			.duration(transitionDuration)
			.attr('y', function(d) {return y(d[0])})
			.attr('x', function(d,i) { return 0 })
			.attr('width', function(d,i) { return boxWidth })
			.attr('height', function(d) { return y(d[2]) - y(d[0]) });
		// tooltip
		utils.tooltipHelper(box, tt, tooltip);

		// median line
        var median = box.selectAll('.median').data(function(d) {return [quartilesValue(d)[1]];});
        // enter
      	median.enter().append("line")
				.attr("class", "median")
				.attr("x1", boxWidth/2)
				.attr("y1", y)
				.attr("x2", boxWidth/2)
				.attr("y2", y)
		// exit
		median.exit().remove();
		// update
		median.transition()
			.duration(transitionDuration)
			.attr("x1", 0)
			.attr("y1", y)
			.attr("x2", boxWidth)
			.attr("y2", y)

		// whiskers
		var whisker = box.selectAll(".whisker").data(function(d) {return whiskersValue(d);});
		if(utils.value_accessor(whiskerType, boxWidth) == 'circle') {
			// enter
	  		whisker.enter().append("circle")
					.attr("class", "whisker")
					.attr("cx", boxWidth/2)
					.attr("cy", y)
					.attr("r", 0 );
			// exit
			whisker.exit().remove();
			// update
			whisker.transition()
				.duration(transitionDuration)
				.attr("cx", boxWidth/2)
				.attr("cy", y)
				.attr("r", boxWidth/2 );
		} else {
			// enter
	  		whisker.enter().append("line")
					.attr("class", "whisker")
					.attr("x1", boxWidth/2)
					.attr("y1", y)
					.attr("x2", boxWidth/2 )
					.attr("y2", y);
			// exit
			whisker.exit().remove();
			// update
			whisker.transition()
				.duration(transitionDuration)
				.attr("x1", 0)
				.attr("y1", y)
				.attr("x2", boxWidth )
				.attr("y2", y);
		}
		// tooltip
	    utils.tooltipHelper(whisker, tt, function(d) { return d; });


		// Add title on hover
	 //    if (tooltip) {
	 //    	var tt = d3.select('.iobio-tooltip')
	 //    	utils.tooltipHelper(g.selectAll('.rect'), tt, tooltip);
	 //    }

	 //    // Attach events
		// events.forEach(function(ev) {
		// 	rect.on(ev.event, ev.listener);
		// })

	}
	// Rebind methods in base.js to this chart
	base.rebind(chart);

	/* Chart Member Functions */

	/*
	 * Value accessor for whiskers
	 * data format = [max, min]
	 */
	chart.whiskersValue = function(_) {
		if (!arguments.length) return whiskersValue;
		whiskersValue = _;
		return chart;
	};

	/*
	 * Value accessor for quartiles
	 * data format = [q3, median, q1]
	 */
	chart.quartilesValue = function(_) {
		if (!arguments.length) return quartilesValue;
		quartilesValue = _;
		return chart;
	};

	/*
   	 * Set outer padding according to https://github.com/d3/d3-3.x-api-reference/blob/master/Ordinal-Scales.md#ordinal_rangeBands
   	 */
	chart.outerPadding = function(_) {
		if (!arguments.length) return outerPadding;
			outerPadding = _;
		return chart;
	}

	/*
   	 * Set step padding according to https://github.com/d3/d3-3.x-api-reference/blob/master/Ordinal-Scales.md#ordinal_rangeBands
   	 */
	chart.padding = function(_) {
		if (!arguments.length) return padding;
			padding = _;
		return chart;
	}

	/*
   	 * Set step padding according to https://github.com/d3/d3-3.x-api-reference/blob/master/Ordinal-Scales.md#ordinal_rangeBands
   	 */
	chart.whiskerType = function(_) {
		if (!arguments.length) return whiskerType;
			whiskerType = _;
		return chart;
	}

	/*
   	 * Set duration of exitTransition
   	 */
	chart.exitTransitionDuration = function(_) {
		if (!arguments.length) return exitTransitionDuration;
			exitTransitionDuration = _;
		return chart;
	}

	/*
   	 * Set class on the g element of each box plot
   	 */
	chart.class = function(_) {
		if (!arguments.length) return klass;
			klass= _;
		return chart;
	}

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
   	 * Easy method to rebind box chart functions to the argument chart
   	 */
	chart.rebind = function(object) {
		base.rebind(object);
		utils.rebind(object, this, 'rebind', 'whiskersValue', 'quartilesValue', 'outerPadding', 'padding', 'whiskerType', 'exitTransitionDuration', 'class');
	}

	return chart;
}

// Export alignment
module.exports = box;