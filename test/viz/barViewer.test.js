'use strict';

var d3 = require('d3'),
    iobio = require('../../src/viz.js');


var m = [30, 60, 44, 70],
        w = 960,
        h = 500;

var div = d3.select("body").append("div").attr('class', 'barViewerchart');
var data = [ [0, 4],  [1,1], [3,3], [6,4], [12,2], [18,7], [23,1], [25,2], [30,1], [36,1], [40,5], [41,3] ];

var barViewerChart = iobio.viz.barViewer()
     .xValue(function(d) { return d[0]; })
     .yValue(function(d) { return d[1]; })
     .wValue(function() { return 1; })
     .height(h)
     .width(w)
     .transitionDuration(0)
     .id(function(d,i) { return 'bar-' + i})
     .margin({top: m[0], right: m[1], bottom: m[2], left:m[3]})
     .sizeRatio(0.8)

var selection = div.datum( data );
barViewerChart( selection );

describe("barViewer", function() {

    // Even transitions with 0 duration take 17ms
    // So delay all tests for 50 ms so transitions can finish
    beforeAll(function(done) {
        window.setTimeout(function(){done();},50);
    });

    it("rects are being drawn", function() {
        var numRects = d3.selectAll('.barViewerchart rect')[0].length
        expect(numRects).toEqual(28);
    });

    it("the id is being set on focalBarChart elems", function() {
        expect(d3.select('.barViewerchart .iobio-bar-0 #bar-2').node()).not.toEqual(null);
    });

    it("the id is being set on globalBarChart elems", function() {
        expect(d3.select('.barViewerchart .iobio-bar-1 #bar-2').node()).not.toEqual(null);
    });

    // it("the tooltip is being set", function() {
    //     expect(typeof d3.select('.barViewerchart #bar-2').on('mouseover')).toEqual('function');
    // });

    // it("the event is being set", function() {
    //     expect(typeof d3.select('.barViewerchart #bar-2').on('click')).toEqual('function');
    // });

    describe("rect", function() {
        var r = d3.select('.barViewerchart #bar-2 rect').node();
        it("is being drawn with the right x value", function() {
          expect(parseInt(r.getAttribute('x'))).toEqual(59);
        });

        it("is being drawn with the right y value", function() {
          expect(parseInt(r.getAttribute('y'))).toEqual(186);
        });

        it("is being drawn with the right width", function() {
          expect(parseInt(r.getAttribute('width'))).toEqual(19);
        });

        it("is being drawn with the right height", function() {
          expect(parseInt(r.getAttribute('height'))).toEqual(139);
        });
    })
});