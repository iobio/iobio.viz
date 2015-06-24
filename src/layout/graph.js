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