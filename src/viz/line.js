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

        selection.each(function() {
            var selection = d3.select(this);


            // Merge defaults and options
            var options = {};
            extend(options, defaults, opts);

            if (options.datumTransform) {
                selection.datum( options.datumTransform(selection.datum()) );
            }

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
                .x(function(d,i) { return +x( xValue(d,i) ); })
                .y(function(d,i) { return +y( yValue(d,i) ); })

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
                 .attr("stroke-dashoffset", 0)

            // Remove stroke-dasharray after done with transition
            // precaution for if path is manipulated elsewhere
            setTimeout(function(){
                path.attr("stroke-dasharray", null)
            }, transitionDuration);
        })
   }

    // Rebind methods in base.js to this chart
    base.rebind(chart);

   return chart;
}

// Export circle
module.exports = line;
