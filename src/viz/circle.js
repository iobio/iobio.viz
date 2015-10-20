var circle = function() {
	// Import base chart
	var base = require('./base.js')();

	// Initialize
	var height = 4;	

	function chart(selection, options) {		
		// Call base chart
		base.call(this, selection, options);

		// Grab base functions for easy access
		var x = base.x(),
			y = base.y(),
			xValue = base.xValue(),
			yValue = base.yValue(),
			wValue = base.wValue();		
		
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
	base.rebind(chart);		

	return chart;
}

// Export circle
module.exports = circle;