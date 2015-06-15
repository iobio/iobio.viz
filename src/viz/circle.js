var circle = function() {
	// Import twod base chart
	var twod = require('./twod.js')();

	// Initialize
	var height = 4;	

	function chart(selection, options) {		
		// Call base chart
		twod.call(this, selection, options);

		// Grab twod functions for easy access
		var x = twod.x(),
			y = twod.y(),
			xValue = twod.xValue(),
			yValue = twod.yValue(),
			wValue = twod.wValue();		
		
		// Draw
		var g = selection.select('g.container'); // grab container to draw into (created by base chart)		
		g.selectAll('.rect')
				.data(selection.datum())
			.enter().append('rect')
				.attr('class', 'rect')
				.attr('x', function(d) { return x(xValue(d)) })
				.attr('y', function(d) { return y(yValue(d)) - height })				
				.attr('width', function(d) { 
					return x(xValue(d)+wValue(d)) - x(xValue(d));
				})
				.attr('height', function(d) { return height });
	}
	// Rebind methods in 2d.js to this chart
	twod.rebind(chart);		

	return chart;
}

// Export circle
module.exports = circle;