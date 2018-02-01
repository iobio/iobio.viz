var multiLine = function() {
	// Import base chart
	var lineBase = require('./line.js')(),
		utils = require('../utils.js'),
		extend = require('extend');


	// Value transformers
	var nameValue = function(d) { return d[0]; },
   	 	dataValue = function(d) { return d[1]; };

   	// Axes
	var xAxis = d3.svg.axis()
			.orient("bottom")
			.tickFormat(utils.format_unit_names)
			.ticks(5);

	// Defaults
	var events = [],
		selected = 'all',
		color = d3.scale.category20(),
		epsilonRate = 0.1;

	// Default Options
	var defaults = { };

	function chart(selection, opts) {
		chart.selection = selection;

		// Merge defaults and options
		var options = {};
		extend(options, defaults, opts);

		var data;
		// Get selected button if one
		selected = options.selected || 'all';

		// Grab base line functions for easy access
        var xValue = chart.xValue(),
        	m = chart.margin(),
        	w = chart.width(),
        	h = chart.height(),
        	x = chart.x(),
        	transitionDuration = chart.transitionDuration();

		// Smoothing function
		var smooth = iobio.viz.layout.pointSmooth()
	    	.size(w)
	    	.pos(function(d,i) { return (d.globalPos || 0) + xValue(d,i)})
	    	.epsilonRate(epsilonRate);

	    // Add global positions to data
	    var curr = 0,
	    	points = [],
	    	selectedGlobalpos;


	    selection.datum().forEach(function(d,i) {

			if (selected == 'all') {
				d.globalPos = curr;
				var pointData = dataValue(d,i);
				curr += chart.xValue()(pointData[pointData.length-1],i);
				pointData.forEach(function(p) {
					p.globalPos = d.globalPos;
				})
				points = points.concat(pointData);
		    } else {
		    	d.globalPos = 0;
	    		if(selected == nameValue(d,i)) {
		      		points = dataValue(d,i);
	      		}
	      }
	    })

	    if (!selection.select('.iobio-multi-line.line-panel').node())
				selection.append('div').attr('class', 'iobio-multi-line line-panel').style('height', parseInt(h) + 'px')
	    if (!options.noLine || selected != 'all') {
			// Create line div to place the line chart in
			// Call base line chart
			if (selected == 'all') { // for all
		        lineBase
		        	.yAxis(null)
		        	.xAxis(null)
		        	.call(this, selection.select('.line-panel').datum(smooth(points)), options);
		        // Remove brush for all
		        selection.select('.iobio-brush').selectAll("*").remove();
		        selection.select('.iobio-axis.iobio-x').selectAll("*").remove();
		    } else {
		    	chart.selectedGlobalpos = selectedGlobalpos
		    	points.forEach(function(d) { d.globalPos = 0; });
		    	if(points.length > 0) {
			    	x.domain([points[0].pos, points.slice(-1)[0].pos ]);
			    	lineBase
			        	.yAxis(null)
			        	.xAxis( xAxis.scale(x) )
			        	.call(this, selection.select('.line-panel').datum(smooth(points)), options);
			    }
		    }
		} else {
			var maxX = points[points.length-1].globalPos + xValue(points[points.length-1]);
			x.range([0,w - m.left - m.right]).domain([0,  maxX]);
		}

		// Create buttons
		selection.selectAll('.iobio-multi-line.button-panel').data([0])
			.enter().append('div')
				.attr('class', 'iobio-multi-line button-panel')
				.style('width', w - m.left - m.right)
				.append('svg')
					.style('width', '100%');

	   	var button = selection.select('.button-panel svg').selectAll('.button')
	    			 	.data( selection.datum(), function(d,i) { return nameValue(d,i); });

	    // Exit
	    button.exit().style('display', 'none');

	   	// Enter
	    var buttonEnter = button.enter().append('g')
	    	.attr('class', 'button')
	    	.attr('transform', function(d) {return 'translate(' + x(d.globalPos) + ')';})
	    	.attr('id', function(d,i) { return 'iobio-button-' + nameValue(d,i) })

		buttonEnter.append('rect')
			.attr('width', function(d,i) {
					var data = dataValue(d,i);
		    		var last = parseInt(xValue(data[data.length-1],i))+parseInt(d.globalPos)
		    		var xpos = x( last ) - x(parseInt(d.globalPos));
		    		return  xpos + 'px'
		    })
		    .attr('height', '20px')
		    .style('fill', color )
		    .append('title')
		    	.text(nameValue);

	    buttonEnter.append('text')
	    	.attr('y', 10)
    		.attr('x', function(d,i) {
    			var data = dataValue(d,i);
	    		var last = parseInt(xValue(data[data.length-1],i))+parseInt(d.globalPos)
	    		var xpos = (x( last ) - x(parseInt(d.globalPos)))/2;
	    		return  xpos + 'px'
	    	})
	    	.attr('alignment-baseline', 'middle')
	    	.attr('text-anchor', 'middle');

	    // Update
	    button.transition()
	    	.duration(transitionDuration)
	    	.style('display', function(d,i) {
	    		if (selected == 'all' || selected == nameValue(d,i) )
	    			return 'block';
	    		else
	    			return 'none';
	    	})
	    	.attr('transform', function(d,i) {return 'translate(' + x(d.globalPos) + ')'; });


	    button.select('rect').transition()
	    	.duration(transitionDuration)
	    	.attr('width', function(d,i) {
	    		var data = dataValue(d,i);
	    		var last = parseInt(xValue(data[data.length-1],i))+parseInt(d.globalPos)
	    		var xpos = x( last ) - x(parseInt(d.globalPos));
	    		return  xpos + 'px'
	    	});

	   	button.select('text').transition()
	   		.duration(transitionDuration)
	   		.attr('x', function(d,i) {
	   			var data = dataValue(d,i);
	    		var last = parseInt(xValue(data[data.length-1],i))+parseInt(d.globalPos)
	    		var xpos = (x( last ) - x(parseInt(d.globalPos)))/2;
	    		return  xpos + 'px'
	    	})
	    	.text(function(d,i) {
	    		// get rect width
	    		var data = dataValue(d,i);
	    		var last = parseInt(xValue(data[data.length-1],i))+parseInt(d.globalPos)
	    		var rectWidth = x( last ) - x(parseInt(d.globalPos));

	    		// get text width
	    		var name = nameValue(d,i)
	    		this.textContent = name;
	    		var textWidth = this.getComputedTextLength();

	    		if ( textWidth <= rectWidth)
	    			return name;
	    	});;


	    // Attach events
	    var userClickCB;
		events.forEach(function(ev) {
			if(ev.event == 'click')
				userClickCB = ev.listener;
			else
				button.on(ev.event, ev.listener);
		})

		// // Add control click event to all buttons
	    button
			.on('click', function(d,i) {
	    		var xMin = d.globalPos;
	    		var xMax = d.globalPos + xValue(d.data[d.data.length-1],i) ;
	    		chart(selection, {'selected':nameValue(d,i) });
	    		// chart(selection, {'xMin': xMin, 'xMax': xMax, 'selected':nameValue(d) });

	    		// Handle user event
	    		if (userClickCB) userClickCB.call(this,d);
	    	})
	    if (selected != 'all') {
	    	selection.select('.line-panel .iobio-container').append('text')
	    			.attr('id', 'iobio-button-all')
	    			.attr('x', m.left + 5)
	    			.attr('y', 0)
	    			.text('< All')
	    			.on('click', function() {
	    				this.remove();
						chart(selection);
						if (userClickCB) userClickCB.call(this);
	    			})
	    }

	}

	// Rebind methods in line chart to this chart
	lineBase.rebind(chart);


	// Member functions
	chart.dataValue = function(_) {
		if (!arguments.length) return dataValue;
		dataValue = _;
		return chart;
	};

	chart.color = function(_) {
		if (!arguments.length) return color;
		color = _;
		return chart;
	};

	chart.epsilonRate = function(_) {
		if (!arguments.length) return epsilonRate;
		epsilonRate = _;
		return chart;
	};

	chart.nameValue = function(_) {
		if (!arguments.length) return nameValue;
		nameValue = _;
		return chart;
	};

	chart.getSelected = function(_) {
		return selected;
	};

	chart.setSelected = function(_) {
		chart(this.selection, {'selected' : _});
		return chart;
	};

	chart.lineChart = function(_) {
		if (!arguments.length) return lineBase;
		lineBase = _;
		return chart;
	}

	chart.trigger = function(event, buttonName) {
		this.selection.select('#iobio-button-' + buttonName).each(function(d, i) {
			var data = d.find(function(d) { return nameValue(d) == buttonName })
		    var onEventFunc = d3.select(this).on(event);
			if(onEventFunc) onEventFunc.apply(this, [data, i]);
		});
	};


	/*
   	 * Set events on buttons
   	 */
	chart.on = function(event, listener) {
		if (!arguments.length) return events;
		events.push( {'event':event, 'listener':listener})
		return chart;
	}


	return chart;
}

// Export alignment
module.exports = multiLine;