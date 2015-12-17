var line = function(container) {
    // Import base chart
    var base = require('./base.js')();
    var utils = require('../utils.js');

    // Defaults
    var numBins = 4,        
        events = [],
        tooltip;
  
    function chart(selection, options) {
        // Call base chart
        base.call(this, selection, options);

        // Grab base functions for easy access
        var x = base.x(),
            y = base.y(),
            id = base.id();
            xValue = base.xValue(),
            yValue = base.yValue(),         
            wValue = base.wValue(),
            transitionDuration = base.transitionDuration()
            color = base.color();

        // Draw
        var lineGen = d3.svg.line()
            .interpolate("linear")
            .x(function(d,i) { return +x( xValue(d) ); })
            .y(function(d) { return +y( yValue(d) ); })

        var g = selection.select('g.iobio-container').classed('iobio-line', true);; // grab container to draw into (created by base chart)             

        // remove previous lines
        g.select('.line').remove();

        // draw line
        var path = g.append("path")
           .attr('class', "line")
           .attr("d", lineGen(selection.datum()) )
           .style("stroke", color)
           .style("stroke-width", "2")
           .style("fill", "none");

         var totalLength = path.node().getTotalLength();

         path
           .attr("stroke-dasharray", totalLength + " " + totalLength)
           .attr("stroke-dashoffset", totalLength)
           .transition()
             .duration( transitionDuration )
             .ease("linear")
             .attr("stroke-dashoffset", 0);


      
   }

    // Rebind methods in 2d.js to this chart
    base.rebind(chart);
   
   return chart;
}

// Export circle
module.exports = line;
