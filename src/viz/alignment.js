var alignment = function() {
	// Import twod base chart
	var twod = require('./twod.js')();
	var utils = require('../utils.js');

	// Defaults
	var elemHeight = 4,
		orientation = 'down',
		events = [],
		tooltip;

	function chart(selection, options) {
		// Call base chart
		twod.call(this, selection, options);

		// Grab twod functions for easy access
		var x = twod.x(),
			y = twod.y(),
			id = twod.id();
			xValue = twod.xValue(),
			yValue = twod.yValue(),			
			wValue = twod.wValue();		

		// Change orientation of pileup
		if (orientation == 'down') {
			// swap y scale min and max
			y.range([y.range()[1],y.range()[0]]);
			// update y axis			
			selection.select(".iobio-y.iobio-axis").transition()
				.duration(0)
				.call(twod.yAxis());
		}

		// Draw
		var g = selection.select('g.container'); // grab container to draw into (created by base chart)		
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
	    	g.selectAll('.rect')
		    	.on("mouseover", function(d,i) {    
		    		var tooltipStr = utils.value_accessor(tooltip, d); // handle both function and constant string       
					tt.transition()        
						.duration(200)      
						.style("opacity", .9);      
					tt.html(tooltipStr)
						.style("left", (d3.event.pageX) + "px") 
						.style("text-align", 'left')
						.style("top", (d3.event.pageY - 24) + "px");    
				})
				.on("mouseout", function(d) {       
					tt.transition()        
						.duration(500)      
						.style("opacity", 0);   
				})
	    }

	    // Add events
		if (events.length > 0) {
			var rect = g.selectAll('.rect');
			events.forEach(function(event) {
				rect.on(event.type, event.action)
			})
		}
	}
	// Rebind methods in 2d.js to this chart
	twod.rebind(chart);

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
	chart.on = function(type, action) {
		events.push( {'type':type, 'action':action})
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