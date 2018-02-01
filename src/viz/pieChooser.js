/*
  pieChooser - a iobio viz component that is a pie chart with clickable slices.  All slices
               can be selected by clicking the 'All' circle in the middle of the pie chart.
*/
var pieChooser = function() {
	// Import base chart
	var base = require("./base.js")(),
		pie = require('./pie.js')(),
		utils = require('../utils.js'),
		extend = require('extend');

	// Defaults
	var events = [],
		eventMap = {},
		tooltip;

	// Default Options
	var defaults = {};

	var name = function(d) { return  d.data.name};

	var chartContainer = null;

	var clickedSlice = null;
	var clickedSlices = [];

	var sliceApiSelected = null;
  	var arcs = null;
 	var radiusOffset;
  	var arc;
  	var options;
  	var labels;
  	var text;

	function chart(selection, opts) {
		// Merge defaults and options
		options = {};
		extend(options, defaults, opts);
		chartContainer = selection;

		arc = d3.svg.arc()
				    .innerRadius(chart.innerRadius())
				    .outerRadius(chart.radius());

		// Stick events in map for easy lookup
		events.forEach(function(ev) {
			eventMap[ev.event] = ev.listener;
		})

		// Create a pie chart
		pie.nameValue(name)
		   .radius(chart.radius())
	       .innerRadius(chart.innerRadius())
	       .padding(chart.padding())
	       .transitionDuration(0)
	       .color(chart.color())
	       .text( function(d,i) {return ""})


	    var listener = eventMap["end"];
		if (listener) {
			pie.on('end', function() { listener.call(chart); })
		}



		pie(selection, options);

		arcs = selection.selectAll('.arc')

		// Handle movements of arcs during mouseover and click
 		arcs.on("mouseover", function(d, i) {
                d3.select(this).attr("cursor", "pointer");
                chart._selectSlice.call(this, d, i, null, true);

				d3.select(this).select("path")
				               .style("stroke", "darkturquoise")
				               .style("stroke-width", "2")
				               .style("opacity", 1);
				if (tooltip) {
					utils.showTooltip(d3.select('.iobio-tooltip'), tooltip, d);
				}

				var listener = eventMap["mouseover"];
				if (listener) {
					listener.call(chart, d, i);
				}

            })
           .on("mouseout", function(d) {
				d3.select(this).attr("cursor", "default");
				if (clickedSlices.length == 0 && this != clickedSlice) {
				d3.select(this)
				  .select("path")
				  .transition()
				  .duration(150).attr("transform", "translate(0,0)");
				}

              	d3.select(this).select("path")
                               .style("stroke-width", "0");

				if (tooltip) {
					utils.hideTooltip(d3.select('.iobio-tooltip'))
				}

                var listener = eventMap["mouseout"];
              	if (listener) {
              		listener.call(chart, d, i);
              	}

            })
           .on("click", function(d, i) {
              	chart._clickSlice(this, d, i, true);

              	var listener = eventMap["click"];
              	if (listener) {
              		listener.call(chart, d, i);
              	}
            });


	    // ALL circle inside of donut chart for selecting all pieces
	    var g = selection.select('.iobio-pie');
	    g.append("circle")
	      .attr("id", "all-circle")
	      .attr("cx", 0)
	      .attr("cy", 0)
	      .attr("r", 25)
	      .attr("stroke", 'lightgrey')
	      .attr("fill", 'transparent')
	      .on("mouseover", function(d) {
	        d3.select(this).attr("cursor", "pointer");
	      })
	      .on("mouseout", function(d) {
	        d3.select(this).attr("cursor", "default");
	      })
		  .on("click", function(d) {
		  		d3.select(this).classed("selected", true);
	          	chart._clickAllSlices(d);
	          	var listener = eventMap["clickall"];
	          	if (listener) {
	          		listener.call(chart, d);
	          	}
	       })
	     g.append("text")
	        .attr("id", "all-text")
	        .attr("dy", ".35em")
	        .style("text-anchor", "middle")
	        .style("pointer-events", "none")
	        .attr("class", "inside")
	        .text(function(d) { return 'All'; })
	        // .each('end', function() { console.log('ennennendndndndnd')});

	}
	// Rebind methods in pie.js to this chart
	base.rebind(chart);

	/*
   	 * Set events on arcs
   	 */
	chart.on = function(event, listener) {
		if (!arguments.length) {
			return events;
		}
		events.push( {'event':event, 'listener':listener})
		return chart;
	}

	/*
   	 * Set tooltip that appears when mouseover arcs
   	 */
	chart.tooltip = function(_) {
		if (!arguments.length) return tooltip;
			tooltip = _;
			return chart;
	}

	chart.name = function(_) {
		if (!arguments.length) return name;
		name = _;
		return name;
	}

	chart.text = function(_) {
		if (!arguments.length) return text;
		text = _;
		return text;
	}

	chart.padding = function(_) {
		if (!arguments.length) return padding;
		padding = _;
		return chart;
	}

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

  	chart._clickSlice = function(theSlice, d, i, singleSelection) {
	    if (singleSelection) {
	      chartContainer.select("circle#all-circle.selected").classed("selected", false);
	    }


	    if (singleSelection) {
	      if (clickedSlices.length > 0) {
	        for (var i = 0; i < clickedSlices.length; i++) {
	          chart._unclickSlice(clickedSlices[i]);
	        }
	        clickedSlices.length = 0;

	      } else if (clickedSlice) {
	        chart._unclickSlice(clickedSlice);
	      }

	    }

	    // Bold the label of the clicked slice
	    d3.select(theSlice).selectAll("text").attr("class", "chartlabelSelected");

	    // Offset the arc even more than mouseover offset
	    // Calculate angle bisector
	    var ang = d.startAngle + (d.endAngle - d.startAngle)/2;
	    // Transformate to SVG space
	    ang = (ang - (Math.PI / 2) ) * -1;

	    // Calculate a 10% radius displacement
	    var x = Math.cos(ang) * radius * 0.1;
	    var y = Math.sin(ang) * radius * -0.1;

	    d3.select(theSlice)
	      .select("path")
	      .attr("transform", "rotate(0)")
	      .transition()
	      .duration(200)
	      .attr("transform", "translate("+x+","+y+")");

	    if (singleSelection) {
	      clickedSlice = theSlice;
	    }
	    else {
	      clickedSlices.push(theSlice);
	    }

	}

    chart._unclickSlice = function(clickedSlice) {
	    // change the previous clicked slice back to no offset
	    d3.select(clickedSlice)
	      .select("path")
	      .transition()
	      .duration(150).attr("transform", "translate(0,0)");

	    // change the previous clicked slice label back to normal font
	    d3.select(clickedSlice).selectAll("text").attr("class", "chartlabel");
	    var labelPos = chart._arcLabelPosition(clickedSlice.__data__, .55);

    	return chart;

  	}

  	chart._selectSlice = function(d, i, gNode, deselectPrevSlice) {
		var theSlice = this;

		// We have a gNode when this function is
		// invoked during initialization to selected
		// the first slice.
		if (gNode) {
		  theSlice = gNode;
		  sliceApiSelected = gNode;

		} else {
		  // We have to get rid of previous selection
		  // when we mouseenter after first chromsome
		  // was auto selected because mouseout
		  // event not triggered when leaving first
		  // selected slice.
		  if (deselectPrevSlice) {
		    if (sliceApiSelected) {
		      d3.select(sliceApiSelected).select("path")
		          .transition()
		          .duration(150)
		          .attr("transform", "translate(0,0)");
		        sliceApiSelected = null;
		    }
		  }
		}

		// show tooltip
		if (options.showTooltip) {
		  _tooltip().transition()
		    .duration(200)
		    .style("opacity", .9);

		  var centroid = arc.centroid(d);

		  var matrix = theSlice.getScreenCTM()
		                       .translate(+theSlice.getAttribute("cx"),
		                                  +theSlice.getAttribute("cy"));
		  // position tooltip
		  _tooltip().html(name(d.data))
		    .style("visibility", "visible")
		    .style("left", (matrix.e + centroid[0]) + "px")
		    .style("top", (matrix.f + centroid[1]- 18) + "px");

		}


		if (theSlice != clickedSlice) {
		  // Calculate angle bisector
		  var ang = d.startAngle + (d.endAngle - d.startAngle)/2;
		  // Transformate to SVG space
		  ang = (ang - (Math.PI / 2) ) * -1;

		  // Calculate a .5% radius displacement (inverse to make slice to inward)
		  var x = Math.cos(ang) * radius * 0.1;
		  var y = Math.sin(ang) * radius * -0.1;
		  d3.select(theSlice)
		    .select("path")
		    .attr("transform", "rotate(0)")
		    .transition()
		    .duration(200)
		    .attr("transform", "translate("+x+","+y+")");

		}
    	return chart;
  	}


	chart._arcLabelPosition = function(d, ratio) {
		var r = ( chart.innerRadius() + chart.radius() ) * ratio;
		var oa = arc.startAngle.call(d);
		var ia = arc.endAngle.call(d);
		a = ( oa(d) + ia(d) ) / 2 - (Math.PI/ 2);
		return [ Math.cos(a) * r, Math.sin(a) * r ];
	};

	chart._clickAllSlices = function(data)  {
		chartContainer.select("circle#all-circle").classed("selected", true);

		clickedSlices.length = 0;
		for (var i = 0; i < data.length; i++) {
		    var theSlice = arcs.selectAll("d.arc")[i].parentNode;
		    chart._clickSlice(theSlice, theSlice.__data__,  i, false);
		}
		return chart;
	}



	chart.clickSlice = function(i) {
		var theSlice = arcs.selectAll("d.arc")[i].parentNode;
		chart._clickSlice(theSlice, theSlice.__data__, i, true);
		chart._selectSlice(theSlice.__data__,  i, theSlice);
		clickedSlice = theSlice;
		return chart;
	}

	chart.clickAllSlices = function(data) {
		chart._clickAllSlices(data);
		var listener = eventMap["clickall"];
      	if (listener) {
      		var circle = chartContainer.select("circle#all-circle.selected");
      		listener.call(chart, circle);
      	}
		return chart;
	}



	return chart;
}

// Export alignment
module.exports = pieChooser;