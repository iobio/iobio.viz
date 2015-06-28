'use strict';



var iobio = require('../src/viz.js'),
	d3 = require('d3');

describe("Viz", function() {	
	var w = 50,
		h = 50;
	
	
    describe("Twod setup", function() {
    	// Create chart to test
    	var twod = iobio.viz.twod()
			.margin({top:0, right:0, bottom:0, left:0})
			.width(w)
			.height(h);
		var data = [ [0,0,1], [9,10,1] ];
		var div = d3.select("body").append("div");
		var selection = div.datum( data );
		var options;
		twod.call(this, selection, options);

		it("updates the svg dimensions", function() {
			var width = div.select('svg').attr('width');
			var height = div.select('svg').attr('height');			
        	expect(width+","+height).toEqual(w+","+h);
        });

		it("creates a chart with the right width", function() {          
        	expect(twod.width()).toEqual(w);
        });

        it("creates a chart with the right height", function() {          
        	expect(twod.height()).toEqual(h);
        });

        it("creates an x scale with the right domain and range", function() {
			var x = twod.x();          
			expect(x(5)).toEqual(25);
        });

        it("creates a y scale with the right domain and range", function() {
			var y = twod.x();          
			expect(y(5)).toEqual(25);
        });

        // Cleanup chart
        d3.select('div').remove();

    });

    describe("Twod Accessors", function() {
    	// Create chart to test
    	var twod = iobio.viz.twod()
			.margin({top:0, right:0, bottom:0, left:0})
			.width(w)
			.height(h)
			.xValue(function(d) { return d.x; })
			.yValue(function(d) { return d.y; })
			.wValue(function(d) { return d.w; })
			.id(function(d) { return 'id-' + d.x + '-' + d.y });
		
		var data = [ {x:0, y:0, w:1}, {x:9, y:10, w:1} ];
		var div = d3.select("body").append("div");
		var selection = div.datum( data );
		var options;
		twod.call(this, selection, options);

    	it("converts xValue from user representation to standard representation", function() {    		
			expect(twod.xValue()(data[0])).toEqual(0);
        });

        it("converts yValue from user representation to standard representation", function() {        	
			expect(twod.yValue()(data[1])).toEqual(10);
        });

        it("converts wValue from user representation to standard representation", function() {
			expect(twod.wValue()(data[1])).toEqual(1);
        });

        it("sets id for each elem", function() {
        	var id = 'id-9-10';        	
			expect(twod.id()(data[1])).toEqual(id);
        });

        // Cleanup chart
        d3.select('div').remove();
    });

	describe("Twod options", function() {
		// Create chart to test
    	var twod = iobio.viz.twod()
			.margin({top:0, right:0, bottom:0, left:0})
			.width(w)
			.height(h)
			.xValue(function(d) { return d.x; })
			.yValue(function(d) { return d.y; })
			.wValue(function(d) { return d.w; })
			.id(function(d) { return 'id-' + d.x + '-' + d.y });
		
		var data = [ {x:0, y:0, w:1}, {x:9, y:10, w:1} ];
		var div = d3.select("body").append("div");
		var selection = div.datum( data );
		var options = {xMin:2, xMax:8} ;
		twod.call(this, selection, options);

		it("uses options to set the x scale min and max instead of determining it form the data", function() {
			expect(twod.x().domain().join(',')).toEqual('2,8');
        });

        // Cleanup chart
        d3.select('div').remove();
	})
    
});

