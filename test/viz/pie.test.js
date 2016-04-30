'use strict';

var d3 = require('d3'),
    iobio = require('../../src/viz.js');

var r = 500/2;

var div = d3.select("body").append("div").attr('class', 'piechart');

var pie = d3.layout.pie().sort(null);
var data = [5,10];
var chart = iobio.viz.pie()
    .radius(r)
    .innerRadius(r-20)
    .transitionDuration(0)
    .id(function(d,i) {return 'arc-' + i})
    .on('click', function() {})
    .tooltip(function() {});

var selection = div.datum( pie(data) );
chart( selection );

describe("pie viz", function() {

    // Even transitions with 0 duration take 17ms
    // So delay all tests for 50 ms so transitions can finish
    beforeAll(function(done) {
        window.setTimeout(function(){done();},50);
    });

    it("arcs are being drawn", function() {
        var num = d3.selectAll('.piechart path')[0].length
        expect(num).toEqual(2);
    });

    it("the id is being set on elems", function() {
        expect(d3.select('.piechart #arc-1').node()).not.toEqual(null);
    });

    it("the tooltip is being set", function() {
        expect(typeof d3.select('.piechart #arc-1').on('mouseover')).toEqual('function');
    });

    it("the event is being set", function() {
        expect(typeof d3.select('.piechart #arc-1').on('click')).toEqual('function');
    });

    describe("arc", function() {
        it("is being drawn with the right x value", function() {
            var a = d3.select('.piechart #arc-1 path').node().getBBox();
            expect(parseInt(a.x)).toEqual(-267);
        });

        it("is being drawn with the right y value", function() {
            var a = d3.select('.piechart #arc-1 path').node().getBBox();
            expect(parseInt(a.y)).toEqual(-250);
        });

        it("is being drawn with the right width", function() {
            var a = d3.select('.piechart #arc-1 path').node().getBBox();
            expect(parseInt(a.width)).toEqual(483);
        });

        it("is being drawn with the right height", function() {
            var a = d3.select('.piechart #arc-1 path').node().getBBox();
            expect(parseInt(a.height)).toEqual(526);
        });
    })
});