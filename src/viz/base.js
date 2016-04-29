var utils = require('../utils.js'),
	extend = require('extend');

var base = function() {
    // Initialize

	// Dimensions
	var margin = {top: 0, right: 0, bottom: 0, left:0},
	    width = 800,
	  	height = 500;

	// Scales
	var x = d3.scale.linear().nice(),
	    y = d3.scale.linear().nice();

	// Axes
	var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.tickFormat(utils.format_unit_names)
			.ticks(5),
		yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.ticks(5);

	// Value transformers
	var xValue = function(d) { return d[0]; },
   	 	yValue = function(d) { return d[1]; },
       	wValue = function(d) { return d[2] || 1 },
       	id = function(d) { return null; };

    // Color
    var colorScale = d3.scale.category10(),
    	color = function(d,i) { return colorScale(i); };

	// Defaults
	var events = [],
		tooltip,
		brush = d3.svg.brush(),
		preserveAspectRatio,
		transitionDuration = 400;

	// Default options
	var defaults = {};

	function chart(selection, opts) {
		var options = {};
		extend(options, defaults, opts);

      	// Get container
      	var container = d3.select( selection.node() );
      	var data = selection.datum();

      	// Select the svg element, if it exists.
		var svg = container.selectAll("svg").data([0]);
		chart.svg = svg;

   		// Otherwise, create svg.
		var gEnter = svg.enter().append("svg").append('g').attr('class', 'iobio-container');
		var g = svg.select('g');

		// Update the outer dimensions.
      	svg.attr("width", width)
        	.attr("height", height);

      	// Update the inner dimensions.
		g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Get width, height in pixels (necessary to allow percentages to work)
		var bcr = svg.node().getBoundingClientRect();
		var widthPx = bcr.width != 0 ? bcr.width : width; // in case boundingClient doesn't work just use width
		var heightPx = bcr.height != 0 ? bcr.height : height;
		var innerHeight = heightPx - margin.top - margin.bottom;

		// Make svg resize when window resizes
		svg.attr('viewBox', '0 0 ' + widthPx + ' ' + heightPx);
		if (preserveAspectRatio) svg.attr('preserveAspectRatio', preserveAspectRatio);
		container.style('-webkit-flex', '1 1 auto')
		container.style('flex', '1 1 auto')
		container.style('-webkit-order', '1')
		container.style('order', '1')

		// Convert data to standard representation greedily;
   		// this is needed for nondeterministic accessors.
   		data = data.map(function(d, i) {return [xValue.call(data, d, i), yValue.call(data, d, i), wValue.call(data, d, i)];});

   		var xMin = (options.xMin === undefined || options.xMin === null) ? d3.min(data, function(d) { return d[0]}) : options.xMin;
   		var xMax = (options.xMax === undefined || options.xMax === null) ? d3.max(data, function(d) { return d[0]+d[2]}) : options.xMax;

		// Update x scale
		x.domain([xMin, xMax]);
		x.range([0, widthPx - margin.left - margin.right]);

		var yMin = (options.yMin === undefined || options.yMin === null) ? d3.min(data, function(d) { return d[1]}) : options.yMin;
		var yMax = (options.yMax === undefined || options.yMax === null) ? d3.max(data, function(d) { return d[1]}) : options.yMax;

		// Update y scale
		y.domain( [yMin, yMax] )
   	 	 .range([innerHeight , 0]);

   	 	// Flesh out skeletal chart
   	 	gEnter.append("g").attr("class", "iobio-x iobio-axis").attr("transform", "translate(0," + y.range()[0] + ")");
   	 	gEnter.append("g").attr("class", "iobio-y iobio-axis");
   		gEnter.append("g").attr("class", "iobio-x iobio-brush");
   		d3.select("body").append("div").attr("class", "iobio-tooltip").style("opacity", 0);

		// Update the x-axis.
		if(xAxis)
			g.select(".iobio-x.iobio-axis").transition()
				.duration(transitionDuration)
				.call(xAxis);

		// Update the y-axis.
		if(yAxis)
			g.select(".iobio-y.iobio-axis").transition()
				.duration(transitionDuration)
				.call(yAxis);

		// Add title on hover
	    if (tooltip) {
	    	var tt = d3.select('.iobio-tooltip')

	    	svg
				.on("mouseover", function(d,i) {
					var pos = {
			    		x: parseInt(x.invert(d3.event.pageX - svg.node().getBoundingClientRect().left - margin.left )),
			    		y: parseInt(y.invert(d3.event.pageY - svg.node().getBoundingClientRect().top - margin.top ))
			    	}
					var opacity = tooltip.call(chart, svg, pos) ? .9 : 0; // don't show if tooltipStr is null
					tt.transition()
						.duration(transitionDuration)
						.style("opacity", opacity);
					tt.html(tooltip.call(chart, svg, pos))
						.style("left", (d3.event.pageX) + "px")
						.style("text-align", 'left')
						.style("top", (d3.event.pageY - 24) + "px");
				})
				.on("mouseout", function(d) {
					tt.transition()
						.duration(500)
						.style("opacity", 0);
				})
		    	.on("mousemove", function() {
		    		var pos = {
			    		x: parseInt(x.invert(d3.event.pageX - svg.node().getBoundingClientRect().left - margin.left )),
			    		y: parseInt(y.invert(d3.event.pageY - svg.node().getBoundingClientRect().top - margin.top ))
			    	}
		    		var opacity = tooltip.call(chart, svg, pos) ? .9 : 0; // don't show if tooltip is null
		    		tt.style('opacity', opacity)
		            tt.html( tooltip.call(chart, svg, pos) )
		               .style("left", (d3.event.pageX) + "px")
		               .style("top", (d3.event.pageY - 24) + "px");
	          })
	    }

	    // Add brush
	    if( brush.on("brushend") || brush.on("brushstart") || brush.on("brush") ) {
	    	brush.x(x);
      		svg.select(".iobio-brush")
					.call(brush)
				.selectAll("rect")
					.attr("y", -6)
					.attr("height", innerHeight + 6);
	    }

		// Attach events
		events.forEach(function(ev) {
			var cb = ev.listener ? function() {ev.listener.call(chart, svg)} : null;
			svg.on(ev.event, cb);
		})

		return data;
	}

	// Member functions
	chart.margin = function(_) {
    	if (!arguments.length) return margin;
    	margin = _;
    	return chart;
  	};

	chart.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return chart;
	};

	chart.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return chart;
	};

	chart.x = function(_) {
		if (!arguments.length) return x;
		x = _;
		return chart;
	};

	chart.y = function(_) {
		if (!arguments.length) return y;
		y = _;
		return chart;
	};

	chart.xValue = function(_) {
		if (!arguments.length) return xValue;
		xValue = _;
		return chart;
	};

	chart.yValue = function(_) {
		if (!arguments.length) return yValue;
		yValue = _;
		return chart;
	};

	chart.wValue = function(_) {
		if (!arguments.length) return wValue;
		wValue = _;
		return chart;
	};

	chart.id = function(_) {
		if (!arguments.length) return id;
		id = _;
		return chart;
	};

	chart.xAxis = function(_) {
		if (!arguments.length) return xAxis;
		xAxis = _;
		return chart;
	};

	chart.yAxis = function(_) {
		if (!arguments.length) return yAxis;
		yAxis = _;
		return chart;
	};

	chart.preserveAspectRatio = function(_) {
		if (!arguments.length) return preserveAspectRatio;
		preserveAspectRatio = _;
		return chart;
	};

	chart.getBoundingClientRect = function(_) {
		return this.svg.node().getBoundingClientRect();
	};

	chart.transitionDuration = function(_) {
		if (!arguments.length) return transitionDuration;
		transitionDuration = _;
		return chart;
	};

	chart.color = function(_) {
		if (!arguments.length) return color;
		color = _;
		return chart;
	};

	/*
   	 * Add brush to chart
   	 */
	chart.brush = function(event, listener) {
		if (!arguments.length) return brush;
		brush.on(event, function() {
			listener.call(this, brush);
		} );
		return chart;
	}

	/*
   	 * Add events to chart
   	 */
	chart.onChart = function(event, listener) {
		if (!arguments.length) return events;
		events.push({'event': event, 'listener': listener});
		return chart;
	}

	/*
   	 * Set tooltip that appears when mouseover chart
   	 */
	chart.tooltipChart = function(_) {
		if (!arguments.length) return tooltip;
		tooltip = _;
		return chart;
	}

	// utility functions


	/*
   	 * Easy method to rebind base chart functions to the argument chart
   	 */
	chart.rebind = function(object) {
		utils.rebind(object, this, 'rebind', 'margin', 'width', 'height', 'x', 'y', 'id',
			'xValue', 'yValue', 'wValue', 'xAxis', 'yAxis', 'brush', 'onChart',
			'tooltipChart', 'preserveAspectRatio', 'getBoundingClientRect', 'transitionDuration', 'color');
	}

	return chart
}

module.exports = base;
