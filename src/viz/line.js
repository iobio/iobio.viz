var line = function(container) {
    // Import base chart
    var base = require('./base.js')();
    var utils = require('../utils.js');

    // Defaults
    var numBins = 4,        
        events = [],
        tooltip;
   // var margin = {top: 0, right: 30, bottom: 30, left: 30},
   //        width = $(container).width()*0.98 - margin.left - margin.right,
   //        height = $(container).height()*0.60 - margin.top - margin.bottom;

   // var numBins = 20;
   
   // var x = d3.scale.linear()
   //     .range([0, width]);
       
   // var brush = d3.svg.brush()
   //    .x(x);
          
   // var svg = d3.select(container).append("svg")
   //    .attr("width", '98%')
   //    .attr("height", '60%')
   //    .attr('viewBox',"0 0 " + parseInt(width+margin.left+margin.right) + " " + parseInt(height+margin.top+margin.bottom))
   //    .attr("preserveAspectRatio", "none")
   //    .append("g")
   //       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    function chart(selection, options) {
        // Call base chart
        base.call(this, selection, options);

        // Grab base functions for easy access
        var x = base.x(),
            y = base.y(),
            id = base.id();
            xValue = base.xValue(),
            yValue = base.yValue(),         
            wValue = base.wValue();

        // Draw
        var lineGen = d3.svg.line()
            .interpolate("linear")
            .x(function(d,i) { return +x( xValue(d) ); })
            .y(function(d) { return +y( yValue(d) ); })

        var g = selection.select('g.container'); // grab container to draw into (created by base chart)     
        g.select(".read-depth-path").remove();
      
        var path = g.append("path")
           .attr('class', "line")
           .attr("d", lineGen(selection.datum()) )
           .attr("stroke", "steelblue")
           .attr("stroke-width", "2")
           .attr("fill", "none");

         var totalLength = path.node().getTotalLength();

         path
           .attr("stroke-dasharray", totalLength + " " + totalLength)
           .attr("stroke-dashoffset", totalLength)
           .transition()
             .duration(2000)
             .ease("linear")
             .attr("stroke-dashoffset", 0);


      
   }

    // Rebind methods in 2d.js to this chart
    base.rebind(chart);
   
   // my.on = function(ev, listener) { 
   //    if (ev == "brush" || ev == "brushstart" || ev == "brushend")
   //       brush.on(ev, function() { listener(x,brush); } );
   //    return my;
   // }
   
   // my.brush = function(value) {
   //    if (!arguments.length) return brush;
   //    brush = value;
   //    return my;
   // };
   
   return chart;
}

// Export circle
module.exports = line;
