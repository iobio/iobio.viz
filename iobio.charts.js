(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Grab an existing iobio namespace object, or create a blank object
// if it doesn't exist
var iobio = window.iobio || {};
iobio.viz = {version: "0.1.0"};
window.iobio = iobio;

// add visualizations
iobio.viz.twod = require('./viz/twod.js')
iobio.viz.circle = require('./viz/circle.js')
iobio.viz.alignment = require('./viz/alignment.js')

// add layouts
iobio.viz.layout = require('./layout/layout.js')

// add utils
iobio.viz.utils = require('./utils.js')

},{"./layout/layout.js":2,"./utils.js":5,"./viz/alignment.js":6,"./viz/circle.js":7,"./viz/twod.js":8}],2:[function(require,module,exports){

var layout = {};
// add layouts
layout.pileup = require('./pileup.js');
layout.referenceGraph = require('./referenceGraph.js');

module.exports = layout;
},{"./pileup.js":3,"./referenceGraph.js":4}],3:[function(require,module,exports){


var pileup = function() {
  var startValue = function(d) { return d.start; },
      endValue = function(d) { return d.end; },    
      sort = 'default',
      size = 400,
      buffer = 0;

  function pileup(data) {

    // Compute the numeric values for each data element.
    var values = data.map(function(d, i) { return [+startValue.call(pileup, d, i),+endValue.call(pileup, d, i)]; });
    var xScale = d3.scale.linear()
            .domain( [values[0][0], values[values.length-1][1]] )
            .range([0, size]);

    // Optionally sort the data.
    var index = d3.range(data.length);
    if (sort != null) index.sort(sort === 'default'
        ? function(i, j) { return values[j][0] - values[i][0]; }
        : function(i, j) { return sort(data[i], data[j]); });

    // Compute the piles!
    // They are stored in the original data's order.
    // TODO: handle widhts that are less than a pixel
    var step = 0;
    var bottomEnd = undefined;
    var piles = [];
    index.forEach(function(i) { 
      var start = values[i][0]      
      var end = values[i][1];
      if ( bottomEnd != undefined && ((xScale(bottomEnd)+buffer) >= xScale(start)) )
        step += 1;
      else {
        step = 0;
        bottomEnd = end;
      }       
      piles[i] = {
        data: data[i],
        x: start,
        w: end-start,
        y: step
      };      
    });
    return piles;
  }

  /**
   * Specifies the value function *x*, which returns a nonnegative numeric value
   * for each datum. The default value function is `return x`. The value function
   * is passed two arguments: the current datum and the current index.
   */
  pileup.startValue = function(_) {
    if (!arguments.length) return startValue;
    startValue = _;
    return pileup;
  };

  /**
   * Specifies the value function *x*, which returns a nonnegative numeric value
   * for each datum. The default value function is `return length`. The value function
   * is passed two arguments: the current datum and the current index.
   */
  pileup.endValue = function(_) {
    if (!arguments.length) return endValue;
    endValue = _;
    return pileup;
  };

  /**
   * Specifies the x scale for the layout. This is necessary to accurately predict
   * which features will overlap
   */
  pileup.size = function(_) {
    if (!arguments.length) return size;
    size = _;
    return pileup;
  };

  /**
   * Specifies the buffer needed between features to not be considered an overlap   
   */
  pileup.buffer = function(_) {
    if (!arguments.length) return buffer;
    buffer = _;
    return pileup;
  };

  /**
   * Specifies the sort function to be used or null if no sort   
   */
  pileup.sort = function(_) {
    if (!arguments.length) return sort;
    sort = _;
    return pileup;
  };

  return pileup;
};

module.exports = pileup;
},{}],4:[function(require,module,exports){
var referenceGraph = function() {
    var sources = d3_layout_referenceGraphSources, targets = d3_layout_referenceGraphTargets, position = d3_layout_referenceGraphPosition;


    function graph(d, i) {    	
      var nodes = graphTraverse(d,i);      
      return nodes;
    }
    
    function graphTraverse(root) {
    	var nodes = [];
    	var visited = {};
    	var uid = getUID();
    	var stack = [ root ];
    	while ((node = stack.pop()) != null) {
    		if (node._visited == uid) continue;
    		nodes.push(node);
    		// mark as visited
    		node._visited = uid;
    		// see if multiple variants at this position
    		var v = visited[position(node)] || (visited[position(node)]=[]);
    		v.push(node);
    		if (v.length ==1 )
    			node.y = 0;
    		else 
    			for (var i=0; i<v.length; i++) {v[i].y = (i/(v.length-1) || 0) * 2 - 1;}    		

    		// push unvisited neighbors on stack
    		var neighbors = [].concat(sources(node), targets(node));    		    		
    		stack = stack.concat( neighbors.filter(function(a) {return a._visited != uid;}) )
    	}
    	return nodes;
    }

    function getUID(separator) {    	
	    /// <summary>
	    ///    Creates a unique id for identification purposes.
	    /// </summary>
	    /// <param name="separator" type="String" optional="true">
	    /// The optional separator for grouping the generated segmants: default "-".    
	    /// </param>

	    var delim = separator || "-";

	    function S4() {
	        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	    }

	    return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());	
    }

    graph.links = function(nodes) {
    	var links = [];
    	nodes.forEach(function(node) {
    		(node.targets || []).map(function(target) {
	        	links.push( {
	          		'source': node,
	          		'target': target
	        	});
	        });
    	})
	    // var l =  d3.merge(nodes.map(function(node) {
	    //   var t =  (node.targets || []).map(function(target) {
	    //     return {
	    //       'source': node,
	    //       'target': target
	    //     };
	    //   });
	    //   return t;
	    // }));
	    return links;
    }
    // graph.size = function(x) {
    //   if (!arguments.length) return nodeSize ? null : size;
    //   nodeSize = (size = x) == null ? sizeNode : null;
    //   return tree;
    // };
    // graph.nodeSize = function(x) {
    //   if (!arguments.length) return nodeSize ? size : null;
    //   nodeSize = (size = x) == null ? null : sizeNode;
    //   return tree;
    // };
    return graph;
  };

  function d3_layout_referenceGraphSources(d) {
    return d.sources;
  }
  function d3_layout_referenceGraphTargets(d) {
    return d.targets;
  }
  function d3_layout_referenceGraphPosition(d) {
    return d.position;
  }
 
 module.exports = referenceGraph;
},{}],5:[function(require,module,exports){

module.exports.format_unit_names = function(d) {
	if ((d / 1000000) >= 1)
		d = d / 1000000 + "M";
	else if ((d / 1000) >= 1)
		d = d / 1000 + "K";
	return d;            
}
},{}],6:[function(require,module,exports){
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
},{"./twod.js":8}],7:[function(require,module,exports){
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
},{"./twod.js":8}],8:[function(require,module,exports){
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
	// Axis
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
       	wValue = function(d) { return d[2] || 1 };
   
	// Variables 
	
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
		gEnter.append("g").attr("class", "x axis").attr("transform", "translate(0," + y.range()[0] + ")");
		gEnter.append("g").attr("class", "y axis");
   	gEnter.append("g").attr("class", "x brush");
   	gEnter.append("div").attr('class', 'tooltip').style('opacity', 0);      	
		var g = svg.select('g');

		// Update the outer dimensions.
      svg.attr("width", width)
         .attr("height", height);

      // Update the inner dimensions.
      g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Update the x-axis.
      g.select(".x.axis").transition()
         .duration(200)
         .call(xAxis);
          
      // Update the y-axis.
      g.select(".y.axis").transition()
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
      d3.rebind(object, this, 'margin', 'width', 'height', 'x', 'y',
       'xValue', 'yValue', 'wValue', 'xAxis', 'yAxis');
   }

	return chart
}

module.exports = twod;

},{"../utils.js":5}]},{},[1])


//# sourceMappingURL=iobio.charts.js.map