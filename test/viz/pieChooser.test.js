'use strict';

var d3 = require('d3'),
    iobio = require('../../src/viz.js');

var div = d3.select("body").append("div").attr('class', 'piechooser');
var m = [15, 35, 25, 15],
    w = 230,
    h = 230,
    r = Math.min(w, h) / 2;

var color = d3.scale.category20b();

var pie = d3.layout.pie()
                   .sort(null)
                   .value(function(d,i) {return d.value});
var references = [
  {name: 'chr1', value: +20},
  {name: 'chr2', value: +14},
  {name: 'chr3', value: +15},
  {name: 'chr4', value: +17},
  {name: 'chr5', value: +23},
  {name: 'chr6', value: +24},
  {name: 'chr7', value: +30}
];

var selection = d3.select(".piechooser").datum( pie(references) );
var chart = iobio.viz.pieChooser()
    .radius(r)
    .innerRadius(r*.5)
    .padding(30)        
    .color( function(d,i) { 
      return color(i); 
    })
    .on("click", function(d,i) {
      console.log("chr clicked " + d );
    })
    .on("clickall", function(d,i) {
      console.log("click all " + d);
    })
    .tooltip( function(d) {
      return d.data.name;
    });
chart( selection );

describe("piechooser viz", function() {

    // Even transitions with 0 duration take 17ms
    // So delay all tests for 50 ms so transitions can finish
    beforeAll(function(done) {
        window.setTimeout(function(){done();},50);
    });

    it("arcs are being drawn", function() {
        var num = d3.selectAll('.piechooser path')[0].length
        expect(num).toEqual(7);
    });

    it("the tooltip is being set", function() {
        expect(typeof d3.select('.piechart .arc').on('mouseover')).toEqual('function');
    });

    it("the event is being set", function() {
        expect(typeof d3.select('.piechart .arc').on('click')).toEqual('function');
    });

    describe("arc", function() {
         it("has the correct text label in the first arc", function() {
             var label = d3.select('.piechooser .arc text').text();
             expect(label).toEqual('chr1');
         });
    })
});