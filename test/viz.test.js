'use strict';



var d3 = require('d3'),
	iobio = require('../src/viz.js');

global.d3 = d3;

describe("Viz", function() {
	var w = 50,
		h = 50;


    describe("Base setup", function() {
    	// Create chart to test
    	var base = iobio.viz.base()
			.margin({top:0, right:0, bottom:0, left:0})
			.width(w)
			.height(h);
		var data = [ [0,0,1], [9,10,1] ];
		var div = d3.select("body").append("div");
		var selection = div.datum( data );
		var options;
		base.call(this, selection, options);

		it("updates the svg dimensions", function() {
			var width = div.select('svg').attr('width');
			var height = div.select('svg').attr('height');
        	expect(width+","+height).toEqual(w+","+h);
        });

		it("creates a chart with the right width", function() {
        	expect(base.width()).toEqual(w);
        });

        it("creates a chart with the right height", function() {
        	expect(base.height()).toEqual(h);
        });

        it("creates an x scale with the right domain and range", function() {
			var x = base.x();
			console.log('x.domain = ' + x.domain())
			console.log('x.range = ' + x.range())
			expect(x(5)).toEqual(25);
        });

        it("creates a y scale with the right domain and range", function() {
			var y = base.x();
			expect(y(5)).toEqual(25);
        });

        // Cleanup chart
        d3.select('div').remove();

    });

    describe("base Accessors", function() {
    	// Create chart to test
    	var base = iobio.viz.base()
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
		base.call(this, selection, options);

    	it("converts xValue from user representation to standard representation", function() {
			expect(base.xValue()(data[0])).toEqual(0);
        });

        it("converts yValue from user representation to standard representation", function() {
			expect(base.yValue()(data[1])).toEqual(10);
        });

        it("converts wValue from user representation to standard representation", function() {
			expect(base.wValue()(data[1])).toEqual(1);
        });

        it("sets id for each elem", function() {
        	var id = 'id-9-10';
			expect(base.id()(data[1])).toEqual(id);
        });

        // Cleanup chart
        d3.select('div').remove();
    });

	describe("base options", function() {
		// Create chart to test
    	var base = iobio.viz.base()
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
		var options = {xMin:2, xMax:8, yMin:0, yMax:9} ;
		base.call(this, selection, options);

		it("uses options to set the x scale min and max instead of determining it form the data", function() {
			expect(base.x().domain().join(',')).toEqual('2,8');
        });

        it("uses options to set the y scale min and max instead of determining it form the data", function() {
			expect(base.y().domain().join(',')).toEqual('0,9');
        });

        // Cleanup chart
        d3.select('div').remove();
	})

});

