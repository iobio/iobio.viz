'use strict';

var iobio = require('../../src/viz.js'),
	d3 = require('d3');	

describe("line", function() {



	var m = [15, 35, 25, 150],
      w = 800,
      h = 600;
        
    var div = d3.select("body").append("div").attr('class', 'linechart');    

    var d = [[1,5],[2,10],[4,20],[7,10],[10,15]];
    
    var selection = div.datum( d );
    var chart = iobio.viz.line()
      .xValue(function(d) { return d[0]; })
      .yValue(function(d) { return d[1]; })
      .wValue(function() { return 1; })
      .height(h)
      .width(w)
      .margin({top: m[0], right: m[1], bottom: m[2], left:m[3]})         
    chart( selection );

   	it("displays the line path correctly", function() {      
   	 var correctPath = 'M0,';
   	 var path = d3.selectAll('.linechart .line').attr('d').split('560L61')[0];

      expect(path).toEqual(correctPath);
    });

});