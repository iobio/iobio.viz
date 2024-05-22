import * as d3 from '../../lib/d3.v7.js';

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
		padding = 0,
		arc,
		events = [],
		tooltip,
		nameValue = '',
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
		arc = d3.arc()
      		.outerRadius(radius)
      		.innerRadius(innerRadius);

		// Call base chart
		base
			// .width(radius*2 + padding)
			// .height(radius*2 + padding)
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
		var pathEnter = path.enter().append("g")
			.attr('id', id)
			.attr('class', 'arc')
			.style('fill', color)

		pathEnter.append('path')
			.attr("d", function(d,i) {
				if (transitionDuration && transitionDuration > 0) {
					return arc({"data":d.data,"value":0,"startAngle":0,"endAngle":0, "padAngle":0});
				} else {
					return arc(d);
				}

			})
			.each(function(d) {
				this._current = {"data":d.data,"value":0,"startAngle":0,"endAngle":0, "padAngle":0};  // store the initial angles
			});

		pathEnter.append('text')
			.attr("transform", function(d) {
	          return "translate(" + arcLabelPosition(d, .5) + ")";
	        })
	        .attr('text-anchor', "middle")
	        .attr('alignment-baseline', "middle")

       	// update
       	if (transitionDuration != undefined && transitionDuration >= 0) {
	       	path.style('fill', color)
	       		.select('path').transition()
		         	.duration( transitionDuration )
		         	.attrTween("d", arcTween)
		         	.call(utils.endAll, function() {
		         		var event = events.find(function(e) { return e.event=='end'; });
		         		if(event) {event.listener.call(chart)}
		         	});

		    path.select('text').transition()
		    	.duration(transitionDuration)
		    	.attr("transform", function(d) {
		    	  var angle = arcLabelAngle(d, 0.55) * (180/Math.PI) - 180;
		          return "translate(" + arcLabelPosition(d, .55) + ") rotate(" + angle + ")";
		        }).text(function(d,i) {
		        	if (!nameValue) return;
		        	var h = ( chart.innerRadius() + chart.radius() ) * 0.55;
					var oa = arc.startAngle.call(d)(d);
					var ia = arc.endAngle.call(d)(d);
		        	var a = (ia - oa);
		        	var width = (Math.sin(a/2)*h) * 2;
		        	var fontSize = parseInt(d3.select(this).style('font-size'));
		        	if (fontSize <= width)
		        		return nameValue(d,i);
		        })
		}


       	// exit
		path.exit().remove();

		// Add middle text
		// g.selectAll('.iobio-center-text').data(selection.datum()).enter().append('text')
		// 	.attr('x', -innerRadius)
		// 	.attr('y', -13)
		// 	.attr('width', innerRadius*2)
		// 	.attr('height', '100%')
		// 	.attr("class", "iobio-center-text")
		// 	.text(function(d) {
		// 		return text(d, total);
		// 	})


		g.selectAll('.iobio-center-text').data([0]).enter().append('foreignObject')
			.attr('x', -innerRadius)
			.attr('y', -innerRadius/2)
			.attr('width', innerRadius*2)
			.attr('height', innerRadius)
			.attr("class", "iobio-center-text")


		g.selectAll('.iobio-center-text').html( text(selection.datum(), total) );


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

	function arcLabelAngle(d, ratio) {
		var r = ( chart.innerRadius() + chart.radius() ) * ratio;
		var oa = arc.startAngle.call(d);
		var ia = arc.endAngle.call(d);
		var a = ( oa(d) + ia(d) ) / 2 - (Math.PI/ 2);
		return a;
	}

	function arcLabelPosition(d, ratio) {
		var r = ( chart.innerRadius() + chart.radius() ) * ratio;
		var a = arcLabelAngle(d, ratio);
		return [ Math.cos(a) * r, Math.sin(a) * r ];
	}

	chart.padding = function(_) {
		if (!arguments.length) return padding;
		padding = _;
		return chart;
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

	chart.nameValue = function(_) {
		if (!arguments.length) return nameValue;
		nameValue = _;
		return chart;
	}


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
