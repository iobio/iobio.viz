var pie = function() {
	// Import base chart
	var base = require('./base.js')(),
		utils = require('../utils.js'),
		extend = require('extend');

	// Initialize
	var total = 0;

	// Defaults
	var radius = 90,
		innerRadius = 0,
		arc,
		events = [],
		tooltip,
		text = function(data, total) {
			var count = data[0].data;
			var percent = utils.format_percent(count/total);
			return "<div class='iobio-percent'>" + percent + "%</div><div class='iobio-count'>" + count + "</div>";
		};

	// Default Options
	var defaults = { };

	function chart(selection, opts) {
		// Merge defaults and options
		var options = {};
		extend(options, defaults, opts);

		// Update arc
		arc = d3.svg.arc()
      		.outerRadius(radius)
      		.innerRadius(innerRadius);

		// Call base chart
		base
			.width(radius*2)
			.height(radius*2)
			.xAxis(null)
			.yAxis(null);
		base.call(this, selection, options);

		// Grab base functions for easy access
		var color = base.color(),
			id = base.id(),
			transitionDuration = base.transitionDuration();

		// Get Total
		total = 0;
		selection.datum().forEach(function(d) {
			total += d.data;
		})

		// Get bounding dimenions
		var boundingCR = base.getBoundingClientRect();

		// Draw
		var g = selection.select('g.iobio-container')
			.classed('iobio-pie', true)
			.attr('transform', 'translate(' +boundingCR.width/2+','+boundingCR.height/2+')'); // grab container to draw into (created by base chart)
		var path = g.selectAll('.arc')
				.data(selection.datum())

		// enter
		path.enter().append("g")
			.attr('id', id)
			.attr('class', 'arc')
			.style('fill', color)
			.append('path')
				.attr("d", function(d) {
					// return arc(d);
					return arc({"data":0,"value":0,"startAngle":0,"endAngle":0, "padAngle":0})
				})
				.each(function(d) { this._current = {"data":0,"value":0,"startAngle":0,"endAngle":0, "padAngle":0}; }); // store the initial angles

       	// update
       	path.select('path').transition()
         	.duration( transitionDuration )
         	.attrTween("d", arcTween);

       	// exit
		path.exit().remove();

		// Add middle text
		g.selectAll('.iobio-center-text').data([0]).enter().append('foreignObject')
			.attr('x', -innerRadius)
			.attr('y', -13)
			.attr('width', innerRadius*2)
			.attr("class", "iobio-center-text")
			// .append("xhtml:div")


		g.selectAll('.iobio-center-text').html( text(selection.datum(), total) );
		// g.selectAll('.iobio-center-text').text( text(selection.datum(), total) );

		// Add title on hover
	    if (tooltip) {
	    	var tt = d3.select('.iobio-tooltip')
	    	utils.tooltipHelper(g.selectAll('.arc'), tt, tooltip);
	    }

	    // Attach events
		events.forEach(function(ev) {
			path.on(ev.event, ev.listener);
		})



	}
	// Rebind methods in base.js to this chart
	base.rebind(chart);

	// Store the displayed angles in _current.
	// Then, interpolate from _current to the new angles.
	// During the transition, _current is updated in-place by d3.interpolate.
	function arcTween(a) {
	  var i = d3.interpolate(this._current, a);
	  this._current = i(0);
	  return function(t) {
	    return arc(i(t));
	  };
	}


   	chart.radius = function(_) {
		if (!arguments.length) return radius;
		radius = _;
		return chart;
	};

	chart.innerRadius = function(_) {
		if (!arguments.length) return innerRadius;
		innerRadius = _;
		return chart;
	};


	chart.text = function(_) {
		if (!arguments.length) return text;
		text = _;
		return text;
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

	return chart;
}

// Export alignment
module.exports = pie;