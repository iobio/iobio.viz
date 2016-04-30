'use strict';

var d3 = require('d3'),
    iobio = require('../../src/viz.js');

var m = [15, 35, 20, 150],
        w = 400,
        h = 200;

var data = [{start:1, end:3, id:'1'}, {start:2, end:4, id:'2'}, {start:3, end:5, id:'3'},{start:4, end:6, id:'4'}];
var div = d3.select("body").append("div").attr('class', 'alignmentchart');

var pileup = iobio.viz.layout.pileup().sort(null).size(w + m[1] + m[3]);
var chart = iobio.viz.alignment()
    .width(w + m[1] + m[3])
    .height(h + m[0] + m[2])
    .margin({top: m[0], right: m[1], bottom: m[2], left:m[3]})
    .xValue(function(d) { return d.x; })
    .yValue(function(d) { return d.y; })
    .wValue(function(d) { return d.w; })
    .transitionDuration(0)
    .id(function(d) { return 'read-' + d.data.id; })
    .on('click', function(d){})
    .tooltip(function(d){});

var selection = div.datum( pileup(data) );
chart(selection);

describe("alignment viz", function() {

    // Even transitions with 0 duration take 17ms
    // So delay all tests for 50 ms so transitions can finish
    beforeAll(function(done) {
        window.setTimeout(function(){done();},50);
    });

    it("the id is being set on elems", function() {
        expect(document.getElementById('read-2')).not.toEqual(null);
    });

    it("the tooltip is being set", function() {
        expect(typeof d3.select('#read-2').on('mouseover')).toEqual('function');
    });

    it("the event is being set", function() {
        expect(typeof d3.select('#read-2').on('click')).toEqual('function');
    });

    describe("read", function() {
        it("is being drawn with the right x value", function() {
            var r = d3.select('#read-2 polygon').node().getBBox();
            expect(r.x).toEqual(-80);
        });

        it("is being drawn with the right y value", function() {
            var r = d3.select('#read-2 polygon').node().getBBox();
            expect(r.y).toEqual(-2);
        });

        it("is being drawn with the right width", function() {
            var r = d3.select('#read-2 polygon').node().getBBox();
            expect(r.width).toEqual(160);
        });

        it("is being drawn with the right height", function() {
            var r = d3.select('#read-2 polygon').node().getBBox();
            expect(r.height).toEqual(4);
        });
    })
});

// describe("alignment", function() {
//     // Even transitions with 0 duration take 17ms
//     // So delay all tests for 50 ms so transitions can finish
//     beforeAll(function(done) {
//         window.setTimeout(function(){done();},50);
//     });

//     it("the id is being set on elems", function() {
//         expect(document.getElementById('read-2')).not.toEqual(null);
//     });

//     it("the tooltip is being set", function() {
//         expect(typeof d3.select('#read-2').on('mouseover')).toEqual('function');
//     });

//     it("the event is being set", function() {
//         expect(typeof d3.select('#read-2').on('click')).toEqual('function');
//     });

//     describe("read", function() {
//         var r = document.getElementById('read-2');
//         var bb = d3.select('#read-2 polygon').node().getBBox();
//         console.log('bb.w = ' + bb.width);
//         console.log('x = ' + r.getAttribute('x'));
//         it("is being drawn with the right x value", function() {
//           expect(r.getAttribute('x')).toEqual('80');
//         });

//         it("is being drawn with the right y value", function() {
//           expect(r.getAttribute('y')).toEqual('98');
//         });

//         it("is being drawn with the right width", function() {
//           expect(r.getAttribute('width')).toEqual('160');
//         });

//         it("is being drawn with the right height", function() {
//           expect(r.getAttribute('height')).toEqual('4');
//         });
//     })
// })