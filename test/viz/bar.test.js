'use strict';

var d3 = require('d3'),
    iobio = require('../../src/viz.js');


var m = [15, 35, 25, 150],
        w = 800,
        h = 600;

var div = d3.select("body").append("div").attr('class', 'barchart');

var data = JSON.parse('{"0": 28, "1": 1, "3": 3, "6": 4, "12": 2, "18": 1, "23": 1, "25": 2, "30": 1, "36": 1, "40": 67, "41": 3}');

var d = Object.keys(data).map(function(k) { return  [+k, +data[k]] });

var chart = iobio.viz.bar()
    .margin({top: m[0], right: m[1], bottom: m[2], left:m[3]})
    .xValue(function(d) { return d[0]; })
    .yValue(function(d) { return d[1]; })
    .wValue(function() { return 1; })
    .height(h)
    .width(w)
    .id(function(d,i) { return 'bar-' + i})
    .transitionDuration(0)
    .on('click', function(d){})
    .tooltip(function(d){});

var selection = div.datum( d );
chart( selection );

describe("bar viz", function() {

    // Even transitions with 0 duration take 17ms
    // So delay all tests for 50 ms so transitions can finish
    beforeAll(function(done) {
        window.setTimeout(function(){done();},50);
    });

    it("rects are being drawn", function() {
        var numRects = d3.selectAll('.barchart rect')[0].length
        expect(numRects).toEqual(12);
    });

    it("the id is being set on elems", function() {
        expect(d3.select('.barchart #bar-2').node()).not.toEqual(null);
    });

    it("the tooltip is being set", function() {
        expect(typeof d3.select('.barchart #bar-2').on('mouseover')).toEqual('function');
    });

    it("the event is being set", function() {
        expect(typeof d3.select('.barchart #bar-2').on('click')).toEqual('function');
    });

    describe("rect", function() {
        var r = d3.select('.barchart #bar-2 rect').node();
        it("is being drawn with the right x value", function() {
          expect(parseInt(r.getAttribute('x'))).toEqual(43);
        });

        it("is being drawn with the right y value", function() {
          expect(parseInt(r.getAttribute('y'))).toEqual(534);
        });

        it("is being drawn with the right width", function() {
          expect(parseInt(r.getAttribute('width'))).toEqual(14);
        });

        // it("is being drawn with the right height", function() {
        //   expect(parseInt(r.getAttribute('height'))).toEqual(25);
        // });
    })
});