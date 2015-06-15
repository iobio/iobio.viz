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