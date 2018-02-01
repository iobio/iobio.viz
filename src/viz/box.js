var box = function() {
	// Import base chart
	var base = require('./base.js')(),
		utils = require('../utils.js'),
		extend = require('extend');

	// Defaults
	var events = [],
		tooltip,
		padding = 0.1,
		outerPadding = 0,
		showLabels = false,
		labels = ['q3', 'median', 'q1', 'whisker', 'whisker'],
		whiskersValue = function(d,i) { return d.whiskers; },
		quartilesValue = function(d,i) { return d.quartiles; },
		boxWidthRatio = function(d,i) { return 1; },
		whiskerType = 'line',
		exitTransitionDuration = 0,
		klass = '',
		compress = false,
		compression = 0.20,
		compressionNumberLabel = function(d,i,boxWidth) {
			if (d.totalBoxes) {
				var textWidth = boxWidth*boxWidthRatio(d,i);
				var numDigits = d.totalBoxes.toString().length;
				if ( textWidth/numDigits > 3) return d.totalBoxes;
				else return null;
			} else return null;
		}
		x = d3.scale.ordinal();

	// Sort Default
	var sort = function(data, compression) {
		return data.sort(function(i,j) {
			var diffM = (quartilesValue(i)[1]-quartilesValue(j)[1]) / ((quartilesValue(i)[1]+quartilesValue(j)[1])/2) ;
			var diffQ1 =  (quartilesValue(i)[0]-quartilesValue(j)[0]) / ((quartilesValue(i)[0]+quartilesValue(j)[0])/2) ;
			var diffQ3 =  (quartilesValue(i)[2]-quartilesValue(j)[2]) / ((quartilesValue(i)[2]+quartilesValue(j)[2])/2) ;

			// return quartilesValue(i)[1]-quartilesValue(j)[1];
			if ( Math.abs(diffM) > compression) { return diffM }
			else {
				return diffQ1 + diffQ3;
			}
		})
	}

	// Compress Function Default
	var compressFunc = function(data, compression) {
		var reducedData = [],currMedian,currQuartile1,currQuartile2,currBox;

	    data.forEach(function(d) {
			if (!currBox) {
				currBox = {};
				extend(true, currBox, d)
				return;
			}

			var medianClose = Math.abs(1 - quartilesValue(currBox)[1]/   quartilesValue(d)[1]) < compression;
			var quartile1Close = Math.abs(1 - quartilesValue(currBox)[0]/quartilesValue(d)[0]) < compression;
			var quartile3Close = Math.abs(1 - quartilesValue(currBox)[2]/quartilesValue(d)[2]) < compression;

			if (medianClose && quartile1Close && quartile3Close && !d.uncompressable) {
				currBox.totalBoxes = currBox.totalBoxes || 1;
				currBox.compressedBoxes = currBox.compressedBoxes || [];
				quartilesValue(currBox)[1] = (quartilesValue(currBox)[1]*currBox.totalBoxes + quartilesValue(d)[1])/ (currBox.totalBoxes+1);
				quartilesValue(currBox)[0] = (quartilesValue(currBox)[0]*currBox.totalBoxes + quartilesValue(d)[0])/ (currBox.totalBoxes+1);
				quartilesValue(currBox)[2] = (quartilesValue(currBox)[2]*currBox.totalBoxes + quartilesValue(d)[2])/ (currBox.totalBoxes+1);
				currBox.totalBoxes += 1;
				currBox.compressedBoxes.push(d);
			} else {
				reducedData.push(currBox);
				currBox = {};
				extend(true, currBox, d);
			}
	    })
	    return reducedData;
	}

	// Base chart changes
	base.xValue(function(d,i){ return i; })

	// Default Options
	var defaults = {sort:true};

	function chart(selection, opts) {
		// Merge defaults and options
		var options = {};
		extend(options, defaults, opts);

		// Sort Data
		var data = (sort && options.sort) ? sort(selection.datum(), compression) : selection.datum();

		// Compress Data
		data = compress ? compressFunc(data, compression) : data;

		options.yMin = options.yMin==undefined ? d3.min(data, function(d) { return +whiskersValue(d)[1]; }) : options.yMin;
		options.yMax = options.yMax==undefined ? d3.max(data, function(d) { return +whiskersValue(d)[0]; }) : options.yMax;

		// Call base chart
		base.wValue(function() { return 1; })
			.call(this, selection, options);

		// Grab base functions for easy access
		var y = base.y(),
			id = base.id(),
			xValue = base.xValue(),
			yValue = base.yValue(),
			wValue = base.wValue(),
			keyValue = base.keyValue(),
			tt = d3.select('.iobio-tooltip'),
			color = base.color(),
			transitionDuration = base.transitionDuration(),
			innerWidth = base.getBoundingClientRect().width - base.margin().left - base.margin().right;

		// Alter scales to work for boxplots

		// Setup X scale
		x.domain( data.map(function(d,i) { return i } ) );

		var totalElemUnits = 0;
		data.forEach(function(d,i) { totalElemUnits += boxWidthRatio(d,i)})
		var totalElems = data.length;
		var step = innerWidth / (outerPadding*2 + padding*(totalElems-1) + (1 - padding)*totalElemUnits);
		var boxWidth = step - step*padding;

		var currX = 0;
		var range = [];
		data.forEach(function(d,i){
			range.push(currX)
			currX += boxWidth*boxWidthRatio(d,i) + step*padding;
		})
		x.range(range);

		// Draw
		var g = selection.select('g.iobio-container').classed('iobio-box', true).select('g.iobio-glyphs').classed('iobio-box', true) // grab container to draw into (created by base chart)

		// g box container
		var box = g.selectAll('.box')
			.data(data, keyValue)

		// enter
		box.enter().append('g')
			.attr('id', id )
			.style('fill', color )
			.attr('transform', function(d,i){
				return "translate(" + x(xValue(d,i)) + ", 0)";
			});
		// exit
	    box.exit().transition().duration(exitTransitionDuration).remove();
		// update
		box.attr('class', function(d,i) { return 'box ' + utils.value_accessor(klass,d,i) })
		box.transition()
			.duration(transitionDuration)
			.attr('transform', function(d,i){return "translate(" + x(xValue(d,i)) + ", 0)";})
			.attr('data-median', function(d) {
				return quartilesValue(d)[1]
			});

		// center line
		var center = box.selectAll('.center').data(function(d,i) { return [d] })
		// enter
		center.enter().insert("line", "rect")
				.attr("class", "center")
				.attr("x1", function(d,i,j) {return (boxWidth*boxWidthRatio(d,j))/2})
				.attr("y1", function(d) { return y(whiskersValue(d)[0]); })
				.attr("x2", function(d,i,j) {return (boxWidth*boxWidthRatio(d,j))/2})
				.attr("y2", function(d) { return y(whiskersValue(d)[1]); })
				.style('opacity', 0);
		//exit
		center.exit().remove();
		// update
		center.transition()
			.duration(transitionDuration)
			.attr("y1", function(d) { return y(whiskersValue(d)[0]); })
			.attr("y2", function(d) { return y(whiskersValue(d)[1]); })
			.style('opacity', 1);

		// compression Number
		// var fd = data.filter(function(d,i) {
  //  			returncompressionNumberLabel(d,i,boxWidth) !== null
  //  		})
		var compressionNumber = box.selectAll('.compressionNumber')
								   .data( function(d) { return [d]; });

		// enter
		compressionNumber.enter().append('text')
				.attr("class", "compressionNumber")
				.attr("x", function(d,i,j) {
					return (boxWidth*boxWidthRatio(d,j))/2
				})
				.attr("y", function(d) { return y(whiskersValue(d)[0]) - 10; })
				.text(function(d,i,j) { return compressionNumberLabel(d,j,boxWidth) })
				.style('text-anchor', 'middle')
				.style('opacity', 0)
				.style('fill', 'rgb(200,200,200')
				.on('click', function(d) {
					d.compressedBoxes.forEach(function(box) { box.uncompressable = true; });
					chart(selection, {sort:false});
				})
		//exit
		compressionNumber.filter(function(d,i,j){ return (compressionNumberLabel(d,i,boxWidth) == null) }).remove();
		// update
		compressionNumber.transition()
			.duration(transitionDuration)
			.attr("x", function(d,i,j) {return (boxWidth*boxWidthRatio(d,j))/2})
			.attr("y", function(d) { return y(whiskersValue(d)[0]) - 7; })
			.style('opacity', 1)
			.text(function(d,i,j) { return compressionNumberLabel(d,j,boxWidth) });

		// rect
		var rect = box.selectAll('.rect').data(function(d) {return [d];});
		// enter
		rect.enter().append('rect')
				.attr('class', 'rect')
				.attr('y', function(d) { return y(quartilesValue(d)[0]) })
				.attr('x', function(d,i,j) { return (boxWidth*boxWidthRatio(d,j))/2 })
				.attr('width', function(d,i) { return 0 })
				.attr('height', function(d) { return y(quartilesValue(d)[2]) - y(quartilesValue(d)[0]) });
		// exit
		rect.exit().remove()
		// update - use selection.selectAll instead of rect b\c rect doesn't supply the i elem for some reason
		rect.transition()
			.duration(transitionDuration)
			.attr('y', function(d,i) {return y(quartilesValue(d)[0])})
			.attr('x', function(d,i) { return 0 })
			.attr('width', function(d,i,j) { return boxWidth*boxWidthRatio(d,j)})
			.attr('height', function(d) { return y(quartilesValue(d)[2]) - y(quartilesValue(d)[0]) });

		// tooltip
		utils.tooltipHelper(box, tt, tooltip);

		// median line
        // var median = box.selectAll('.median').data(function(d) {return [quartilesValue(d)[1]];});
        var median = box.selectAll('.median').data(function(d) {return [d];});
        // enter
      	median.enter().append("line")
				.attr("class", "median")
				.attr("x1", function(d,i,j) {return (boxWidth * boxWidthRatio(d,j))/2 })
				.attr("y1", function(d) { return y(quartilesValue(d)[1]) })
				.attr("x2", function(d,i,j) {return (boxWidth * boxWidthRatio(d,j))/2 })
				.attr("y2", function(d) { return y(quartilesValue(d)[1]) })

		// exit
		median.exit().remove();
		// update
		median.transition()
			.duration(transitionDuration)
			.attr("x1", 0)
			.attr("y1", function(d) { return y(quartilesValue(d)[1]) })
			.attr("x2", function(d,i,j) {return boxWidth * boxWidthRatio(d,j)})
			.attr("y2", function(d) { return y(quartilesValue(d)[1]) })

		// whiskers
		var whisker = box.selectAll(".whisker").data(function(d,i) {
			var w = whiskersValue(d);
			var width = boxWidthRatio(d,i)*boxWidth;
			return [[w[0],width], [w[1], width]];
		});
		if(utils.value_accessor(whiskerType, boxWidth) == 'circle') {
			// enter
	  		whisker.enter().append("circle")
					.attr("class", "whisker")
					.attr("cx", function(d,i) {return d[1]/2})
					.attr("cy", function(d,i) {return y(d[0]) })
					.attr("r", 0 );
			// exit
			whisker.exit().remove();
			// update
			selection.selectAll('.whisker').transition()
				.duration(transitionDuration)
				.attr("cx", function(d,i) {return d[1]/2})
				.attr("cy", function(d,i) {return y(d[0]) })
				.attr("r", function(d,i) {return d[1]/2});
		} else {
			// enter
	  		whisker.enter().append("line")
					.attr("class", "whisker")
					.attr("x1", function(d,i) { return d[1]/2})
					.attr("y1", function(d,i) {return y(d[0]) })
					.attr("x2", function(d,i) {return d[1]/2})
					.attr("y2", function(d,i) {return y(d[0]) });
			// exit
			whisker.exit().remove();
			// update
			selection.selectAll('.whisker').transition()
				.duration(transitionDuration)
				.attr("x1", 0)
				.attr("y1", function(d,i) {return y(d[0]) })
				.attr("x2", function(d,i) {return d[1] })
				.attr("y2", function(d,i) {return y(d[0]) })
		}
		// box plot labels
		if (showLabels) {
			var label = box.selectAll(".label").data(function(d) {
				return quartilesValue(d).concat(whiskersValue(d));
			});
			// enter
			label.enter().append("text")
				.attr("class", "label")
				.attr("x", function(d,i) {return boxWidth + 2 })
				.attr("y", y)
				.attr("alignment-baseline", "middle")
				.text(function(d,i){ return labels[i] });
			// exit
			label.exit().remove()
			// enter
			label.transition()
				.duration(transitionDuration)
				.attr("x", function(d,i) {return boxWidth + 2 })
				.attr("y", y)
				.text(function(d,i){ return labels[i] });


		}


		// tooltip
	    utils.tooltipHelper(whisker, tt, function(d) { return d; });


		// Add title on hover
	 //    if (tooltip) {
	 //    	var tt = d3.select('.iobio-tooltip')
	 //    	utils.tooltipHelper(g.selectAll('.rect'), tt, tooltip);
	 //    }

	 //    // Attach events
		// events.forEach(function(ev) {
		// 	rect.on(ev.event, ev.listener);
		// })

	}
	// Rebind methods in base.js to this chart
	base.rebind(chart);

	/* Chart Member Functions */

	/*
	 * Boolean for showing the labels
	 * data format = true | false
	 */
	chart.showLabels = function(_) {
		if (!arguments.length) return showLabels;
		showLabels = _;
		return chart;
	};

	/*
	 * Array for defining the labels
	 * data format = true | false
	 */
	chart.labels = function(_) {
		if (!arguments.length) return labels;
		labels = _;
		return chart;
	};

	/*
	 * Value accessor for whiskers
	 * data format = [max, min]
	 */
	chart.whiskersValue = function(_) {
		if (!arguments.length) return whiskersValue;
		whiskersValue = _;
		return chart;
	};

	/*
	 * Value accessor for quartiles
	 * data format = [q3, median, q1]
	 */
	chart.quartilesValue = function(_) {
		if (!arguments.length) return quartilesValue;
		quartilesValue = _;
		return chart;
	};

	/*
	 * Sets the boxWidthRatio, which allows boxes to be of different widths
	 * e.g. function(d,i) { if (i==2) return 3; else return 1; }) would make
	 * the 3rd box 3 times as wide as all the other boxes
	 * default is 1
	 */
	chart.boxWidthRatio = function(_) {
		if (!arguments.length) return boxWidthRatio;
		boxWidthRatio = _;
		return chart;
	};

	/*
	 * Set the sort function that determines the order of the box plots
	 * Same as JS sort function
	 * if set to null, then no sorting will occur
	 */
	chart.sort = function(_) {
		if (!arguments.length) return sort;
		sort = _;
		return chart;
	};

	/*
	 * Boolean to either compress the box plots or not
	 * If true multiple similar boxPlots will try to be compressed into
	 * a single box plot using the compressFunc
	 */
	chart.compress = function(_) {
		if (!arguments.length) return compress;
		compress = _;
		return chart;
	};

	/*
	 * The function that compress the box plot data
	 * This should return an array of data
	 */
	chart.compressFunc = function(_) {
		if (!arguments.length) return compressFunc;
		compressFunc = _;
		return chart;
	};

	/*
	 * Takes value between '0' and '1'
	 * Determines how aggressively to compress the box plot data
	 */
	chart.compression = function(_) {
		if (!arguments.length) return compression;
		compression = _;
		return chart;
	};

	/*
	 * Function for the text to be written on compressed boxes
	 */
	chart.compressionNumberLabel = function(_) {
		if (!arguments.length) return compressionNumberLabel;
		compressionNumberLabel = _;
		return chart;
	};

	/*
   	 * Set outer padding according to https://github.com/d3/d3-3.x-api-reference/blob/master/Ordinal-Scales.md#ordinal_rangeBands
   	 */
	chart.outerPadding = function(_) {
		if (!arguments.length) return outerPadding;
			outerPadding = _;
		return chart;
	}

	/*
   	 * Set step padding according to https://github.com/d3/d3-3.x-api-reference/blob/master/Ordinal-Scales.md#ordinal_rangeBands
   	 */
	chart.padding = function(_) {
		if (!arguments.length) return padding;
			padding = _;
		return chart;
	}

	/*
   	 * Either a 'line' or a 'circle'
   	 */
	chart.whiskerType = function(_) {
		if (!arguments.length) return whiskerType;
			whiskerType = _;
		return chart;
	}

	/*
   	 * Set duration of exitTransition
   	 */
	chart.exitTransitionDuration = function(_) {
		if (!arguments.length) return exitTransitionDuration;
			exitTransitionDuration = _;
		return chart;
	}

	/*
   	 * Set class on the g element of each box plot
   	 */
	chart.class = function(_) {
		if (!arguments.length) return klass;
			klass= _;
		return chart;
	}

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

	/*
   	 * Easy method to rebind box chart functions to the argument chart
   	 */
	chart.rebind = function(object) {
		base.rebind(object);
		utils.rebind(object, this, 'rebind', 'showLabels', 'labels', 'whiskersValue', 'quartilesValue', 'boxWidthRatio', 'sort', 'compress', 'compressFunc', 'compression', 'compressionNumberLabel', 'outerPadding', 'padding', 'whiskerType', 'preserveAspectRatio', 'exitTransitionDuration', 'class');
	}

	return chart;
}

// Export alignment
module.exports = box;