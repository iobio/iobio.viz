var alignment = function() {
	// Import twod base chart
	var twod = require('./twod.js')();

	// Initialize
	var height = 4,
		idValue = function() { return ''},
		orientation = 'down';	

	function chart(selection, options) {		
		// Call base chart
		twod.call(this, selection, options);

		// Grab twod functions for easy access
		var x = twod.x(),
			y = twod.y(),
			xValue = twod.xValue(),
			yValue = twod.yValue(),			
			wValue = twod.wValue();		

		if (orientation == 'down')
			y.range([y.range()[1],y.range()[0]]);

		// Draw
		var g = selection.select('g.container'); // grab container to draw into (created by base chart)		
		g.selectAll('.rect')
				.data(selection.datum())
			.enter().append('rect')
				.attr('class', 'rect')
				// .style('stroke', 'red')
				// .style('stroke-width', '0.5')
				// .style('fill', 'blue')
				.attr('x', function(d) { return x(xValue(d)) })
				.attr('y', function(d) { return y(yValue(d)) - height + 2 })				
				.attr('id', function(d) { return idValue(d)})
				.attr('width', function(d) { 
					return x(xValue(d)+wValue(d)) - x(xValue(d));
				})
				.attr('height', function(d) { return height });
	}
	// Rebind methods in 2d.js to this chart
	twod.rebind(chart);

	/**
   	* Specifies the orientation of the alignment. Can be 'up' or 'down'   
   	*/
  	chart.orientation = function(_) {
    	if (!arguments.length) return orientation;
    	orientation = _;
    	return chart;
  	};

	chart.idValue = function(_) {
		if (!arguments.length) return idValue;
		idValue = _;
		return chart; 
	};

	return chart;
}

// Export alignment
module.exports = alignment;