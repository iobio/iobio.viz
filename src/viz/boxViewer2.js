var boxViewer2 = function() {
	// Import base chart
	var box = require('./box.js'),
		base = require('./base.js')()
		utils = require('../utils.js'),
		extend = require('extend');

	// Defaults
	var events = [],
		tooltip,
		sizeRatio = 0.8,
		origHeight,
		exitDuration = 0;

	// Default Options
	var defaults = { };

	// Base Chart
	var basebox = box();
	var focalbox, globalbox;

	function chart(selection, opts) {
		// Merge defaults and options
		var options = {};
		extend(options, defaults, opts);

		// Set Height
		origHeight = chart.height();

		// Setup both chart divs
		selection.selectAll('div')
				.data([0,0])
			.enter().append('div')
				.attr('class', function(d,i) { return 'iobio-box-' + i + ' iobio-boxViewer' });

		// Call big box chart
		focalbox = box()
			.height( origHeight * sizeRatio )
			.xValue( chart.xValue() )
			.yValue( chart.yValue() )
			.wValue( chart.wValue() )
			.xAxis( chart.xAxis() )
			.yAxis( chart.yAxis() )
			.whiskersValue( chart.whiskersValue() )
			.quartilesValue( chart.quartilesValue() )
			.boxWidthRatio( chart.boxWidthRatio() )
			.sort( chart.sort() )
			.compress( chart.compress() )
			.compressFunc( chart.compressFunc() )
			.compression( chart.compression() )
			.compressionNumberLabel( chart.compressionNumberLabel() )
			.outerPadding( chart.outerPadding() )
			.padding( chart.padding() )
			.whiskerType( chart.whiskerType() )
			.class( chart.class() )
			.margin( chart.margin() )
			.width( chart.width() )
			.preserveAspectRatio( chart.preserveAspectRatio() )
			.y( chart.y() )
			.x( chart.x() )
			.id( chart.id() )
			.keyValue( chart.keyValue() )
			.color( chart.color() )
			.tooltip( chart.tooltip() )
			.transitionDuration( chart.transitionDuration() )

		var focalSelection = selection.select('.iobio-box-0').datum( selection.datum() )
		focalbox(focalSelection, options);

		// var doctype = '<?xml version="1.0" standalone="no"?>'
  // + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

  // 		var source = (new XMLSerializer()).serializeToString(d3.select('.iobio-box-0 svg').node());
  // 		var blob = new Blob([ doctype + source], { type: 'image/svg+xml;charset=utf-8' });
  // 		var url = window.URL.createObjectURL(blob);
  // 		var img = d3.select('body').append('img')
  // 			.style('border', '1px solid red')
  // 			.attr('id', 'chase')
		// 	.attr('width', 800)
		// 	.attr('height', 400)
		// 	.node();
		// img.src = url;

		// Call little box chart
		globalbox = base
			.xValue( chart.xValue() )
			.yValue( chart.yValue() )
			.wValue( chart.wValue() )
			.xAxis( chart.xAxis() )
			.yAxis( null )
			.margin( chart.margin() )
			.width( chart.width() )
			.preserveAspectRatio( chart.preserveAspectRatio() )
			.transitionDuration( chart.transitionDuration() )
			.id( chart.id() )
			.keyValue( chart.keyValue() )
			.height( origHeight * (1-sizeRatio) )
			.brush('brush', function() {
				var x2 = globalbox.x(), brush = globalbox.brush();
	        	var x = brush.empty() ? x2.domain() : brush.extent();
	        	var datum = globalSelection.datum().filter(function(d,i) {
	        		return (globalbox.xValue()(d,i) >= x[0] && globalbox.xValue()(d,i) <= x[1])
	        	});

	        	//  Delay exit when sliding brush window
	        	// if (brush.empty())
	        	// 	focalbox.exitTransitionDuration(0)
	        	// else
	        	// 	focalbox.exitTransitionDuration( focalbox.transitionDuration() )

	        	// Draw
	        	options.xMin = x[0];
	        	options.xMax = x[1];
	        	options.globalbox = globalbox;
	        	options.sort = false;
	           	focalbox( focalSelection.datum(datum), options );
			});

		var globalSelection = selection.select('.iobio-box-1').datum( selection.datum() )
		globalbox(globalSelection, options);

		setTimeout(function() {
			var doctype = '<?xml version="1.0" standalone="no"?>'
			  + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
			// serialize our SVG XML to a string.
			// styles(document.getElementById('testSvg'));
			var svgNode = d3.select('.iobio-box-0 svg g.iobio-glyphs').node()
			utils.addStylesToSvg(svgNode)
			var source1 = (new XMLSerializer()).serializeToString(svgNode);
			// var source = '<svg xmlns="http://www.w3.org/2000/svg" width="960" height="400" viewBox="0 0 960 400">' + source1 + '</svg>';
			var source = '<svg xmlns="http://www.w3.org/2000/svg" width="960" height="400">' + source1 + '</svg>';
			// var source = (new XMLSerializer()).serializeToString(svgNode);
			// create a file blob of our SVG.
			var blob = new Blob([ doctype + source], { type: 'image/svg+xml;charset=utf-8' });
			var url = window.URL.createObjectURL(blob);
			// Put the svg into an image tag so that the Canvas element can read it in.

			var gHeight = globalbox.height() - globalbox.margin().top - globalbox.margin().bottom;
			var gWidth = globalbox.width();
			var img = d3.select('.iobio-box-1 .iobio-glyphs').append('foreignObject')
			 .attr('width', gWidth)
			 .attr('height', gHeight)
			 .append('xhtml:img')
			 	.attr('width', gWidth)
			 	.attr('height', gHeight)
			 	.node();

			img.src = url;

			// var img = d3.select('.iobio-box-1 .iobio-glyphs').append('foreignObject')
			//  .attr('width', 960)
			//  .attr('height', 100)
			//  .append('xhtml:div')
			// 	 .attr('width', 960)
			// 	 .attr('height', 100)
			// 	 .style('border', '1px solid red')
			// 	 .node();

		},chart.transitionDuration());

		// // Add title on hover
	 //    if (tooltip) {
	 //    	var tt = d3.select('.iobio-tooltip')
	 //    	utils.tooltipHelper(g.selectAll('.rect'), tt, tooltip);
	 //    }

	 //    // Attach events
		// events.forEach(function(ev) {
		// 	var cb = ev.listener ? function() {ev.listener.call(chart, svg)} : null;
		// 	g.selectAll('.rect').on(ev.event, cb);
		// })
		// focalbox.rebind(this);
	}

	// Rebind methods in box chart to this chart
	basebox.rebind(chart);

	/*
   	 * Set events on rects
   	 */
	chart.sizeRatio = function(_) {
		if (!arguments.length) return sizeRatio;
		sizeRatio = _;
		return chart;
	};

	/*
   	 * Set events on rects
   	 */
	chart.on = function(event, listener) {
		if (!arguments.length) return events;
		events.push( {'event':event, 'listener':listener})
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

	chart.focalbox = function(_) {
		if (!arguments.length) return focalbox;
		focalbox = _;
		return chart;
	}

	chart.globalbox = function(_) {
		if (!arguments.length) return globalbox;
		globalbox = _;
		return chart;
	}

	return chart;
}

// Export alignment
module.exports = boxViewer2;