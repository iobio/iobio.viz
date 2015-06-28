(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
// Grab an existing iobio namespace object, or create a blank object
// if it doesn't exist
var iobio = global.iobio || {};
global.iobio = iobio;

// export if being used as a node module - needed for test framework
if ( typeof module === 'object' ) { module.exports = iobio;}

// Create Base Object
iobio.viz = {};

// Add visualizations
iobio.viz.twod = require('./viz/twod.js')
iobio.viz.circle = require('./viz/circle.js')
iobio.viz.alignment = require('./viz/alignment.js')
iobio.viz.referenceGraph = require('./viz/referenceGraph.js')

// Add layouts
iobio.viz.layout = require('./layout/layout.js')

// Add shapes
iobio.viz.svg = require('./svg/svg.js')

// Add utils
iobio.viz.utils = require('./utils.js')

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./layout/layout.js":4,"./svg/svg.js":6,"./utils.js":8,"./viz/alignment.js":9,"./viz/circle.js":10,"./viz/referenceGraph.js":11,"./viz/twod.js":12}],2:[function(require,module,exports){
var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var undefined;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	'use strict';
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var has_own_constructor = hasOwn.call(obj, 'constructor');
	var has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {}

	return key === undefined || hasOwn.call(obj, key);
};

module.exports = function extend() {
	'use strict';
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && isArray(src) ? src : [];
					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = extend(deep, clone, copy);

				// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],3:[function(require,module,exports){
var utils = require('../utils.js');

var graph = function() {
    // Defaults
    var sources = function(d) { return d.sources },
        targets = function(d) { return d.targets },
        position = function(d) { return d.position };
    
    function layout(root) {
    	var nodes = [];
    	var visited = {};
    	var uid = utils.getUID();
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

    /*
     * Identifies the links between all nodes
     */
    layout.links = function(nodes) {
    	var links = [];
    	nodes.forEach(function(node) {
    		(node.targets || []).map(function(target) {
	        	links.push( {
	          		'source': node,
	          		'target': target
	        	});
	        });
    	})
	    return links;
    }

    /*
     * Specifies the value function *sources*, which returns an array of node objects
     * for each datum. The default value function is `return sources`. The value function
     * is passed two arguments: the current datum and the current index.
     */    
    layout.sources = function(_) {
        if (!arguments.length) return sources;
            sources = _;
            return chart;
    }

    /*
     * Specifies the value function *targets*, which returns an array of node objects
     * for each datum. The default value function is `return targets`. The value function
     * is passed two arguments: the current datum and the current index.
     */
    layout.targets = function(_) {
        if (!arguments.length) return targets;
            targets = _;
            return chart;
    }

    /*
     * Specifies the value function *position*, which returns a nonnegative numeric value
     * for each datum. The default value function is `return position`. The value function
     * is passed two arguments: the current datum and the current index.
     */
    layout.position = function(_) {
        if (!arguments.length) return position;
            position = _;
            return chart;
    }
    // TODO: do these functions still make sense?
    // layout.size = function(x) {
    //   if (!arguments.length) return nodeSize ? null : size;
    //   nodeSize = (size = x) == null ? sizeNode : null;
    //   return tree;
    // };
    // layout.nodeSize = function(x) {
    //   if (!arguments.length) return nodeSize ? size : null;
    //   nodeSize = (size = x) == null ? null : sizeNode;
    //   return tree;
    // };
    return layout;
  };
 
 module.exports = graph;
},{"../utils.js":8}],4:[function(require,module,exports){

var layout = {};
// add layouts
layout.pileup = require('./pileup.js');
layout.graph = require('./graph.js');

module.exports = layout;
},{"./graph.js":3,"./pileup.js":5}],5:[function(require,module,exports){


var pileup = function() {
  // Defaults
  var start = function(d) { return d.start; },
      end = function(d) { return d.end; },    
      sort = 'default',
      size = 400,
      buffer = 0;

  function layout(data) {

    // Compute the numeric values for each data element.
    var values = data.map(function(d, i) { return [+start.call(layout, d, i),+end.call(layout, d, i)]; });
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

  /*
   * Specifies the value function *start*, which returns a nonnegative numeric value
   * for each datum. The default value function is `return start`. The value function
   * is passed two arguments: the current datum and the current index.
   */
  layout.start = function(_) {
    if (!arguments.length) return startValue;
    startValue = _;
    return layout;
  };

  /*
   * Specifies the value function *end*, which returns a nonnegative numeric value
   * for each datum. The default value function is `return end`. The value function
   * is passed two arguments: the current datum and the current index.
   */
  layout.end = function(_) {
    if (!arguments.length) return endValue;
    endValue = _;
    return layout;
  };

  /*
   * Specifies the x scale for the layout. This is necessary to accurately predict
   * which features will overlap in pixel space.
   */
  layout.size = function(_) {
    if (!arguments.length) return size;
    size = _;
    return layout;
  };

  /*
   * Specifies the buffer needed between features to not be considered an overlap   
   */
  layout.buffer = function(_) {
    if (!arguments.length) return buffer;
    buffer = _;
    return layout;
  };

  /*
   * Specifies the sort function to be used or null if no sort   
   */
  layout.sort = function(_) {
    if (!arguments.length) return sort;
    sort = _;
    return layout;
  };

  return layout;
};

module.exports = pileup;
},{}],6:[function(require,module,exports){

var svg = {};
// add shapes
svg.variant = require('./variant.js');

module.exports = svg;
},{"./variant.js":7}],7:[function(require,module,exports){
var variant = function() { 
    
    // Value transformers
    var xValue = function(d) { return d.x; },
        yValue = function(d) { return d.y; },
        wValue = function(d) { return d.w; },
        hValue = function(d) { return d.h; };

    var diagonal = d3.svg.diagonal()        

    function shape(d, i) {    
        diagonal
            .source(function(d) { return {"x":hValue(d)*d.y, "y":d.x+Math.abs(d.w/2)}; })            
            .target(function(d) { return {"x":0, "y":d.x+d.w/2+Math.abs(d.w/2)}; })
            .projection(function(d) { return [d.y, d.x]; });
        
        var variantH = hValue(d);
        var bulbW = Math.abs(variantH * 5/6);
        // Create control points
        var c1 = variantH * 1/6+yValue(d),
            c2 = variantH*2/6+yValue(d),
            c3 = variantH*0.625+yValue(d),
            c4 = variantH*1.145+yValue(d);

        if (wValue(d) <= Math.abs(bulbW/2))
            return "M" +xValue(d)+","+yValue(d)+" C" +xValue(d)+ "," +c1+" "+parseInt(xValue(d)+wValue(d)/2-bulbW/2)+ "," +c2+" "+parseInt(xValue(d)+wValue(d)/2-bulbW/2)+ "," +c3+" C" +parseInt(xValue(d)+wValue(d)/2-bulbW/2)+ "," +c4+" "+parseInt(xValue(d)+wValue(d)/2+bulbW/2)+ "," +c4+" "+parseInt(xValue(d)+wValue(d)/2+bulbW/2)+ "," +c3+" C" +parseInt(xValue(d)+wValue(d)/2+bulbW/2)+ "," +c2+" "+parseInt(xValue(d)+wValue(d))+"," +c1+" "+parseInt(xValue(d)+wValue(d))+","+yValue(d);            
        else
            return diagonal(d)+diagonal({x:xValue(d), y:yValue(d), w:-wValue(d)});
    }

    /*
     * Specifies the value function *x*, which returns an integer for each datum
     * The value function is passed two arguments: the current datum and the current index.
     */  
    shape.xValue = function(_) {
        if (!arguments.length) return xValue;
        xValue = _;
        return shape;
    }

    /*
     * Specifies the value function *y*, which returns an integer for each datum
     * The value function is passed two arguments: the current datum and the current index.
     */  
    shape.yValue = function(_) {
        if (!arguments.length) return yValue;
        yValue = _;
        return shape;
    };

    /*
     * Specifies the value function *width*, which returns an integer for each datum
     * The value function is passed two arguments: the current datum and the current index.
     */  
    shape.wValue = function(_) {
        if (!arguments.length) return wValue;
        wValue = _;
        return shape;
    }; 

    /*
     * Specifies the value function *height*, which returns an integer for each datum
     * The value function is passed two arguments: the current datum and the current index.
     */  
    shape.hValue = function(_) {
        if (!arguments.length) return hValue;
        hValue = _;
        return shape;
    }; 

    return shape;
};

module.exports = variant;
},{}],8:[function(require,module,exports){

module.exports.format_unit_names = function(d) {
	if ((d / 1000000) >= 1)
		d = d / 1000000 + "M";
	else if ((d / 1000) >= 1)
		d = d / 1000 + "K";
	return d;            
}

module.exports.getUID = function(separator) {    	
    var delim = separator || "-";

    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());	
}

module.exports.value_accessor = function(value, d) {
	return typeof value === 'function' ? value(d) : value;
}
},{}],9:[function(require,module,exports){
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
},{"../utils.js":8,"./twod.js":12}],10:[function(require,module,exports){
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
},{"./twod.js":12}],11:[function(require,module,exports){
var referenceGraph = function() {
	var graph = require('../layout/graph.js')();
	var diagonal = d3.svg.diagonal()
    	.projection(function(d) { return [d.y, d.x]; });
    var utils = require('../utils.js')

	// Import twod base chart
	var twod = require('./twod.js')();

	// Defaults
	var elemHeight = 10,
		orientation = 'down',
		levelHeight = 50,
		events = [],
		tooltip,
		variant = iobio.viz.svg.variant();

	// Remove y axis
	twod.yAxis(null);

	function chart(selection, options) {		
		// Call base chart
		twod.call(this, selection, options);

		// Grab twod functions for easy access
		var x = twod.x(),
			y = twod.y().domain([-1,1]),
			id = twod.id(),
			xValue = twod.xValue(),
			yValue = twod.yValue(),			
			wValue = twod.wValue();

		// Set variant accessors
		variant
			.xValue(function(d) { return x(+xValue(d)); })
			.wValue(function(d) { return x(xValue(d)+wValue(d)) - x(+xValue(d)); })			
			.yValue(function(d) { return yValue(d)>0 ? y(0)+elemHeight : y(0); })			
			.hValue(function(d) { return levelHeight * yValue(d); });

		// Draw nodes
		var g = selection.select('g.container'); // grab container to draw into (created by base chart)
		var gEnter = g.selectAll('g.node')
				.data(selection.datum(), function(d) { return d.id ; })
			.enter().append('svg:g')
				.attr('class', 'node')				
		
		// Draw line
		selection.selectAll('g.node')
			.filter(function(d){ return yValue(d) == 0 })
			.append("svg:rect")			
				.attr('id', function(d) { return id(d)})	
				.attr('x', function(d) { return x(+xValue(d)); })	
				.attr('y', function(d) { return y(+yValue(d)); })			
				.attr('width', function(d) { return x(xValue(d)+wValue(d)) - x(+xValue(d));})
				.attr('height', function(d) { return elemHeight })
				.attr('class', function(d) {
					var step = +yValue(d);
					if (step == 0) return 'reference'; 
					else  if (step > 0) return 'below-variant';
					else return 'above-variant';
				});

		// Draw Variants
		selection.selectAll('g.node')
			.filter(function(d){ return yValue(d) != 0 })
			.append("svg:path")			
				.attr('id', function(d) { return id(d)})
				.attr('d', variant)
				.attr('class', function(d) {
					var step = +yValue(d);
					if (step == 0) return 'reference'; 
					else  if (step > 0) return 'below-variant';
					else return 'above-variant';
				});

		// Add title on hover
	    if (tooltip) {	 
	    	var div = d3.select('.iobio-tooltip')	    	
	    	g.selectAll('.node')
		    	.on("mouseover", function(d,i) {
		    		var tooltipStr = utils.value_accessor(tooltip, d); // handle both function and constant string
					div.transition()        
						.duration(200)      
						.style("opacity", .9);      
					div.html(tooltipStr)
						.style("left", (d3.event.pageX) + "px") 
						.style("text-align", 'left')
						.style("top", (d3.event.pageY - 24) + "px");    
				})
				.on("mouseout", function(d) {       
					div.transition()        
						.duration(500)      
						.style("opacity", 0);   
				})
	    }

	    // Add events
		if (events.length > 0) {
			var rect = g.selectAll('.node');
			events.forEach(function(event) {
				rect.on(event.type, event.action)
			})
		}
	}
	// Rebind methods in 2d.js to this chart
	twod.rebind(chart);

	/*
   	 * Set events on variants
   	 */
	chart.on = function(type, action) {
		events.push( {'type':type, 'action':action})
		return chart;
	}

	/*
   	 * Set height of variant levels
   	 */
	chart.levelHeight = function(_) {
		if (!arguments.length) return levelHeight;
		levelHeight = _;
		return chart; 
	}

	/*
   	 * Set drawing function for variants. Function must have the following 
   	 * accessor functions:
   	 * xValue, yValue, wValue, hValue
   	 */
	chart.variant = function(_) {
		if (!arguments.length) return variant;
		variant = _;
		return chart; 
	}

	/*
   	 * Set tooltip that appears when mouseover variants
   	 */
	chart.tooltip = function(_) {
		if (!arguments.length) return tooltip;
			tooltip = _;
			return chart; 
	}

	return chart;
}

// Export referenceGraph
module.exports = referenceGraph;
},{"../layout/graph.js":3,"../utils.js":8,"./twod.js":12}],12:[function(require,module,exports){
var utils = require('../utils.js'),
	extend = require('extend');

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

	function chart(selection, opts) {
		var options = {};
		extend(options, defaults, opts);    			
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

},{"../utils.js":8,"extend":2}]},{},[1])


//# sourceMappingURL=iobio.viz.js.map