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
		arc,
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

		// update arc
		arc = d3.svg.arc()
      		.outerRadius(radius)
      		.innerRadius(innerRadius);

		// Call base chart
		base
			.width(radius*2)
			.height(radius*2)
			.xAxis(null)
			.yAxis(null);	
		base.call(this, selection, options);			

		// Grab base functions for easy access
		var color = base.color(),
			id = base.id(),
			transitionDuration = base.transitionDuration();

		// Get Total		
		total = 0;
		console.log('during selection.datum() = ' + selection.datum()[0].data );
		selection.datum().forEach(function(d) {
			total += d.data;
		})

		// Get bounding dimenions
		var boundingCR = base.getBoundingClientRect();

		// Draw		
		var g = selection.select('g.container').attr('transform', 'translate(' +boundingCR.width/2+','+boundingCR.height/2+')'); // grab container to draw into (created by base chart)		
		var gData = g.selectAll('.iobio-arc')
				.data(selection.datum())		

		// enter
		gData.enter().append("path")
         .attr("d", function(d) { return arc({"data":0,"value":0,"startAngle":0,"endAngle":0}) })
         .attr('class', 'iobio-arc')
         .attr('id', id)         
         .style('fill', color);

        // // Add center text
        // gData.enter().append("text")
        //  .attr("dy", "0.3em")
        //  .style("text-anchor", "middle")
        //  .attr("class", "iobio-center-text")
        //  .text(function(d,i) { if(i==0) return text( utils.format_percent(d.data/total) , d.data);});         

       // update
       g.selectAll('.iobio-arc').transition()
         .duration( transitionDuration )
       	 .attr("d", arc)       	 

       // g.selectAll('.iobio-center-text').transition()
       // 	.text(function(d,i) { 
       // 		if(i==0) {
       // 			console.log('d = ' + d.data);
       // 			console.log('p = ' + text( utils.format_percent(d.data/total), d.data));
       // 			return text( utils.format_percent(d.data/total), d.data); 
       // 		}

       // 	});

       	// exit
		gData.exit().remove();

		// Add Middle text
		g.selectAll('.iobio-center-text').data([0]).enter().append('foreignObject')	
			.attr('x', -innerRadius)
			.attr('y', -13)
			.attr('width', innerRadius*2)						
			.attr("class", "iobio-center-text")    			
			// .append("xhtml:div")
				

		g.selectAll('.iobio-center-text').html( text(selection.datum(), total) );
		// g.selectAll('.iobio-center-text').text( text(selection.datum(), total) );

		// Add title on hover	   
	    // if (tooltip) {	 
	    // 	var tt = d3.select('.iobio-tooltip')   	
	    // 	utils.tooltipHelper(g.selectAll('.rect'), tt, tooltip);
	    // }

	    // Attach events
		// events.forEach(function(ev) {
		// 	var cb = ev.listener ? function() {ev.listener.call(chart, svg)} : null;
		// 	g.selectAll('.rect').on(ev.event, cb);			
		// })	

	}
	// Rebind methods in base.js to this chart
	base.rebind(chart);
	
   	
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


	chart.text = function(_) {
		if (!arguments.length) return text;
		text = _;
		return text; 
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