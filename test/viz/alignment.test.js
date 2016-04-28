'use strict';

var iobio = require('../../src/viz.js'),
	d3 = require('d3');

describe("alignment", function() {

	var m = [15, 35, 20, 150],
    	w = 400,
    	h = 200;

    var data1 = [{start:1, end:3, id:'1'}, {start:2, end:4, id:'2'}, {start:3, end:5, id:'3'},{start:4, end:6, id:'4'}];
    var div = d3.select("body").append("div");

    var pileup = iobio.viz.layout.pileup().sort(null).size(w + m[1] + m[3]);
    var chart = iobio.viz.alignment()
      .width(w + m[1] + m[3])
      .height(h + m[0] + m[2])
      .margin({top: m[0], right: m[1], bottom: m[2], left:m[3]})
      .xValue(function(d) { return d.x; })
      .yValue(function(d) { return d.y; })
      .wValue(function(d) { return d.w; })
      .id(function(d) { return 'read-' + d.data.id; })
      .tooltip(function(d) { return "id:  " + d.data.id + "<br/>" + "pos: " + d.data.start + ' - ' + d.data.end })
      .on('click', function(d) { return 'hi'; })
    var p = pileup(data1);
    var selection = div.datum( p );
    chart(selection);

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
      // Add tests for x,y positions and height width
	})

})