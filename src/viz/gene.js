//
// consumes data in following format
// var data = [ {name: 'somename',
//              start: someInt,
//              end : someInt,
//              strand : '+',
//              features : [{start:someInt, end:someInt, feature_type:utr, strand:'+'},
//                          {start:someInt, end:someInt, feature_type:cds}, ...]
//            }, ... ]
//

var gene = function() {
    // Import base chart
    var base = require('./base.js')(),
        utils = require('../utils.js'),
        extend = require('extend');

    // Defaults
    var events = [],
        tooltip,
        trackHeight = 20,
        borderRadius = 1,
        utrHeight = undefined,
        cdsHeight = undefined,
        arrowHeight = undefined,
        start = function(d) { return d.start; },
        end = function(d) { return d.end; },
        title = function(d) { return d.transcript_id; };

    // Default Options
    var defaults = { };

    // Modify Base Chart
    base
        .yAxis(null)
        .xValue(function(d) { return start(d); })
        .yValue(function(d,i) { return i; })
        .wValue(function(d) { return end(d) - start(d); })

    function chart(selection, opts) {
        // Merge defaults and options
        var options = {};
        extend(options, defaults, opts);

        // Set variables if not user set
        utrHeight = utrHeight || trackHeight / 2;
        arrowHeight = arrowHeight || trackHeight / 2;
        cdsHeight = cdsHeight || trackHeight;

        // Call base chart
        base.call(this, selection, options)

        // Grab base functions for easy access
        var x = base.x(),
            y = base.y(),
            id = base.id();
            xValue = base.xValue(),
            yValue = base.yValue(),
            wValue = base.wValue(),
            color = base.color(),
            transitionDuration = base.transitionDuration();

        // Grab Container
        var g = selection.select('g.iobio-container').classed('iobio-gene', true); // grab container to draw into (created by base chart)

        // Move Axis up
        g.select('.iobio-axis').attr('transform', 'translate(0,-25)');


        // Draw
        // enter
        var transcript = g.selectAll('.transcript')
                .data(selection.datum())
        // exit
        transcript.exit().remove()

        // enter
        transcript.enter().append('g')
                .attr('class', 'transcript')
                .attr('id', id )
                .attr('transform', function(d,i) { return "translate(0,0)"});

        transcript.selectAll('.reference').data(function(d) { return [[start(d), end(d)]] })
            .enter().append('line')
                .attr('class', 'reference')
                .attr('x1', function(d) { return x(d[0])})
                .attr('x2', function(d) { return x(d[1])})
                .attr('y1', trackHeight/2)
                .attr('y2', trackHeight/2);

        transcript.selectAll('.name').data(function(d) { return [[start(d), title(d)]] })
            .enter().append('text')
                .attr('class', 'name')
                .attr('x', function(d) { return x(d[0])-5; })
                .attr('y', trackHeight/2)
                .attr('text-anchor', 'end')
                .attr('alignment-baseline', 'middle')
                .text( function(d) { return d[1]; } )
                .style('fill-opacity', 0)

        transcript.selectAll('.arrow').data(centerSpan)
            .enter().append('path')
                .attr('class', 'arrow')
                .attr('d', centerArrow);

        transcript.selectAll('.feature').data(function(d) {
            return d['features'].filter( function(d) { var ft = d.feature_type.toLowerCase(); return ft == 'utr' || ft == 'cds';})
        }).enter().append('g')
                .attr('class', function(d) { return d.feature_type.toLowerCase() + ' feature';})
                .style('fill', color )
                .append('rect')
                    .attr('rx', borderRadius)
                    .attr('ry', borderRadius)
                    .attr('x', function(d) { return x(d.start)})
                    .attr('width', function(d) { return x(d.end) - x(d.start)})
                    .attr('y', trackHeight /2)
                    .attr('height', 0);

        // update
        transcript.transition()
                .duration(transitionDuration)
                .attr('transform', function(d,i) { return "translate(0," + y(i) + ")"});

        transcript.selectAll('.reference').transition()
            .duration(transitionDuration)
            .attr('x1', function(d) { return x(d[0])})
            .attr('x2', function(d) { return x(d[1])});

        transcript.selectAll('.arrow').transition()
            .duration(transitionDuration)
            .attr('d', centerArrow);

        transcript.selectAll('.name').transition()
            .duration(transitionDuration)
            .attr('x', function(d) { return x(d[0])-5; })
            .attr('y', trackHeight/2)
            .text( function(d) { return d[1]; } )
            .style('fill-opacity', 1);

        transcript.selectAll('.feature').selectAll('rect').sort(function(a,b){ return parseInt(a.start) - parseInt(b.start)})
            .transition()
                .duration(transitionDuration)
                .attr('x', function(d) { return x(d.start)})
                .attr('width', function(d) { return x(d.end) - x(d.start)})
                .attr('y', function(d) {
                    if(d.feature_type.toLowerCase() =='utr') return (trackHeight - utrHeight)/2;
                    else return (trackHeight - cdsHeight)/2; })
                .attr('height', function(d) {
                    if(d.feature_type.toLowerCase() =='utr') return utrHeight;
                    else return cdsHeight; });

        // Add tooltip on hover
        if (tooltip) {
            var tt = d3.select('.iobio-tooltip')
            utils.tooltipHelper(transcript.selectAll('.utr,.cds'), tt, tooltip);
        }

        // Attach events
        events.forEach(function(ev) {
            g.selectAll('.transcript').on(ev.event, ev.listener);
        })

    }
    // Rebind methods in base.js to this chart
    base.rebind(chart);

    // Helper Functions

    // moves selection to front of svg
    function moveToFront(selection) {
        return selection.each(function(){
             this.parentNode.appendChild(this);
        });
    }

    // updates the hash with the center of the biggest span between features
    function centerSpan(d) {
        var span = 0;
        var center = 0;
        var sorted = d.features
            .filter(function(f) { var ft = f.feature_type.toLowerCase(); return ft == 'utr' || ft == 'cds'})
            .sort(function(a,b) { return parseInt(a.start) - parseInt(b.start)});

        for (var i=0; i < sorted.length-1; i++) {
            var currSpan = parseInt(sorted[i+1].start) - parseInt(sorted[i].end);
            if (span < currSpan) {
                span = currSpan;
                center = parseInt(sorted[i].end) + span/2;
            }
        }
        d.center = center;
        return [d];
    }

    // generates the arrow path
    function centerArrow(d) {
        var x = chart.x();
        var arrowHead = parseInt(d.strand + '5');
        var pathStr = "M ";
        pathStr += x(d.center) + ' ' + (trackHeight - arrowHeight)/2;
        pathStr += ' L ' + parseInt(x(d.center)+arrowHead) + ' ' + trackHeight/2;
        pathStr += ' L ' + x(d.center) + ' ' + parseInt(trackHeight + arrowHeight)/2;
        return pathStr;
    }

    chart.trackHeight = function(_) {
        if (!arguments.length) return trackHeight;
        trackHeight = _;
        return chart;
    };

    chart.utrHeight = function(_) {
        if (!arguments.length) return utrHeight;
        utrHeight = _;
        return chart;
    };

    chart.cdsHeight = function(_) {
        if (!arguments.length) return cdsHeight;
        cdsHeight = _;
        return chart;
    };

    chart.arrowHeight = function(_) {
        if (!arguments.length) return arrowHeight;
        arrowHeight = _;
        return chart;
    };


    chart.start = function(_) {
        if (!arguments.length) return start;
        start = _;
        return chart;
    };

    chart.end = function(_) {
        if (!arguments.length) return end;
        end = _;
        return chart;
    };

    chart.title = function(_) {
        if (!arguments.length) return title;
        title = _;
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
    };

    return chart;
}

// Export alignment
module.exports = gene;