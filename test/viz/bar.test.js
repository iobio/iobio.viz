'use strict';

var iobio = require('../../src/viz.js'),
	d3 = require('d3');	

describe("bar", function() {
	var m = [15, 35, 25, 150],
      w = 800,
      h = 600;

  var div = d3.select("body").append("div").attr('class', 'barchart');    

  var data = JSON.parse('{"0": 28, "1": 1, "3": 3, "6": 4, "12": 2, "18": 1, "23": 1, "25": 2, "30": 1, "36": 1, "40": 67, "41": 3}');    
  
  var d = Object.keys(data).map(function(k) { return  [+k, +data[k]] });    
  
  var selection = div.datum( d );
  var chart = iobio.viz.bar()
    .xValue(function(d) { return d[0]; })
    .yValue(function(d) { return d[1]; })
    .wValue(function() { return 1; })
    .height(h)
    .width(w)
    .margin({top: m[0], right: m[1], bottom: m[2], left:m[3]})      
  chart( selection );
	
	it("rects are being drawn", function() {
		var numRects = d3.selectAll('.barchart rect')[0].length		
    expect(numRects).toEqual(12);
  });
});