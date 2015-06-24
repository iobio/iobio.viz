var utils = require('../utils.js');

var twod = function() {
    // Initialize

	// Dimensions
	var margin = {top: 15, right: 15, bottom: 25, left:30},
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
	
	// Default options
	var defaults = {};

	function chart(selection, options) {		
		var options = $.extend(defaults, options);	
		var innerHeight = height - margin.top - margin.bottom;
      
      	// Get container
      	var container = d3.select(selection[0][0]);
      	var data = selection.datum();					

		// Convert data to standard representation greedily;
   		// this is needed for nondeterministic accessors.
   		data = data.map(function(d, i) {return [xValue.call(data, d, i), yValue.call(data, d, i), wValue.call(data, d, i)];});			

   		var xMin = options.xMin || d3.min(data, function(d) { return d[0]});
   		var xMax = options.xMax || d3.max(data, function(d) { return d[0]+d[2]});
		// Update x scale
		x.domain([xMin, xMax]);         
		x.range([0, width - margin.left - margin.right]);

		// Update y scale
		y.domain( d3.extent(data, function(d) { return d[1]}) )
   	 	 .range([innerHeight , 0]);

   		// Select the svg element, if it exists.
		var svg = container.selectAll("svg").data([0]);		

   		// Otherwise, create the skeletal chart.      
		var gEnter = svg.enter().append("svg").append('g').attr('class', 'container');      
		gEnter.append("g").attr("class", "iobio-x iobio-axis").attr("transform", "translate(0," + y.range()[0] + ")");
		gEnter.append("g").attr("class", "iobio-y iobio-axis");
   		gEnter.append("g").attr("class", "iobio-x brush");
   		d3.select("body").append("div").attr("class", "iobio-tooltip").style("opacity", 0);
		var g = svg.select('g');

		// Update the outer dimensions.
      	svg.attr("width", width)
        	.attr("height", height);

      	// Update the inner dimensions.
		g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Update the x-axis.
		if(xAxis)
			g.select(".iobio-x.iobio-axis").transition()
				.duration(200)
				.call(xAxis);
		  
		// Update the y-axis.
		if(yAxis)	
			g.select(".iobio-y.iobio-axis").transition()
				.duration(200)
				.call(yAxis);			
		
		return data;
	}

	// member functions
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

	// utility functions
	chart.rebind = function(object) {
		d3.rebind(object, this, 'margin', 'width', 'height', 'x', 'y', 'id',
			'xValue', 'yValue', 'wValue', 'xAxis', 'yAxis');
	}

	return chart
}

module.exports = twod;
