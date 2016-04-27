var line = function(container) {
    // Import base chart
    var base = require('./base.js')(),
        utils = require('../utils.js'),
        extend = require('extend');

    // Defaults
    var numBins = 4,
        events = [],
        tooltip;

    // Default Options
    var defaults = { };

    function chart(selection, opts) {
        // Merge defaults and options
        var options = {};
        extend(options, defaults, opts);

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

        var g = selection.select('g.iobio-container').classed('iobio-line', true); // grab container to draw into (created by base chart)

        // draw line
        var gEnter = g.selectAll('.line').data([0])
            .enter().append("path")
                .attr('class', "line")
                .attr("d", lineGen(selection.datum()) )
                .style("stroke", color)
                .style("stroke-width", "2")
                .style("fill", "none");

        var path = g.select('path.line');
        var totalLength = path.node().getTotalLength();

        // draw line from left first time
        gEnter
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength);

        path
           .transition()
             .duration( transitionDuration )
             .attr('d', lineGen(selection.datum()) )
             .ease("linear")
             .attr("stroke-dashoffset", 0);
   }

    // Rebind methods in base.js to this chart
    base.rebind(chart);

   return chart;
}

// Export circle
module.exports = line;
