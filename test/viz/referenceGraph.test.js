'use strict';

var iobio = require('../../src/viz.js'),
	d3 = require('d3');	

describe("referenceGraph", function() {
var graph = iobio.viz.layout.graph();
	var dot = "digraph gwiz { \n\
0 [ label = '4010000 TTTTCTGGTAACACCATGGGTTGGGGAGAGGGAGGG' ]; \n\
0 -> 1; \n\
0 -> 2; \n\
1 [ label = '4010036 A' ]; \n\
1 -> 3; \n\
2 [ label = '4010036 G' ]; \n\
2 -> 3; \n\
3 [ label = '4010037 TGAATAGGTGAAGCACAGGA' ]; \n\
3 -> 4; \n\
3 -> 5; \n\
4 [ label = '4010057 CTTTTTTG' ]; \n\
4 -> 6; \n\
5 [ label = '4010057 CTTTTTTTG' ]; \n\
5 -> 6; \n\
6 [ label = '4010066 GGGCAGTGAAACTCCTCTGTATCATACTGTCACAGTGGGTCCATGTCATTAAACATTTGTCTAAACTCATAGACTGTACAACACCAACGGTGAGCCCTAATGTGGACTATGGACTTGGGGTGATTGATATGGTTTGACCGTGTCCCCACCCAAATCTCATCTTGAATTTCCATGTGTT' ]; \n\
6 -> 7; \n\
6 -> 8; \n\
7 [ label = '4010244 T' ]; \n\
7 -> 9; \n\
8 [ label = '4010244 C' ]; \n\
8 -> 9; \n\
9 [ label = '4010245 GGGGAGGGACCCAGTGGAAGGTAATTGAATCATGGGGCAGGTCTTTCCTATGCTGTTCTCCTGACAGTGAATAAGTCTCATGAGATATGATGGTTTCATAAACAGGAGTTTCCCTGCACATGCTCTCTTCTCTTGTCTGCCACCATGATTATGAAGCCTCCCCAGCCACGTGGAACCATAAGTCCAAAAAGCCTCTTCTGTAAATTGCCCAGTCTCAGATATGTCTTTATCAGCAGCGTGAAAATGGACTAATACAGTGATAATGACATGTTAATGCAGGTTCATCAGTTGTAATAAATGTACTATTTGGTGGGGGATATTAATAGTTGGGGAGGCTGTGTGTGTGGGGGTGGGACAGAGAGTACATGTGAACTCTCTGTACCTTCTGTTGGATTTTGCTGTGAGCCTAAAACCGCTCTAAAACCATATAAAGTCCATCTACAAAAGTATCTGAGAGGCTAAATCTATCTCTATAAGAAATATGAGGAAAGAAGTAGCAGGGGAGATGCAAAAGGGGAATGGGGTGGGGGTATTAGAGAGGATTTCTGGAATTTGCCCTGTGAGAGGCTCTGAGACAGATATAGGAGGAAGAGAATTAGGGAAGGGAGAAAAGAAGTATGGCTGTGGGCTATAAATTAGATCCACGCTGAGGCAGGAGGATTGCTTCAGGCCAGGAGTTTGAGACTAGCCTGGGCAACATAGCAAGACCTTATCTCTATCAAAAAAAAAAAATAATAAAAAACAGGGCATGGTGGCACATGCCTGTAGTCCCAGCTACAAGAGGCTGAGCAGGGAGGATTGCTTGCACCCAGGAGGTCAAGGCTGCAGTGAGCCGAGATCCTGCCACTGCACTCCAGCCTGGGCCACAGAGTGAGACTGTCTCAAAAAAAAAAAAGTTAGATCCATGATCATTTTCCTGAAGAGATTCGAGGACAGCTTAGTGCTACCTTTGATGCTGTATTCTACTTTTTTTTTTTTTTTTTTTTTTGAGATGGAGTCTCGCTCCGTCGCTCAGGCTGGAGTGCAGTGGCATGATTGCAAGCTCCGCCTCTCGGGTTCACGCCATTCTCCTGCCTCGGCCTCCTGAGTAGCTGGGACTACAGGCGCCTGCCACCACGCCTGGCTAATTTTTTGTATTTTTAGTAGAGACAGGGTTTCACCATGTTAGCCAGGATGGCCTCGATCTCCTGACCTCATGATCCGCCTGCCTCGGCCTCCCAAGGTGCTGGAATTACAGGTGAGAGCCACTTCGCCTGGCCTATTCTTCTTTGAATTTAATTTCTCATTGAGACTGGACCACATGGGATCCTAGCTTACATCTGGGTTACATTTGTAGATTAAGTTTAACCCATTTATGCCTAGTGTTCCATTATTGGAACGCTAAGCTTGTGGGAATAATTTATATCTGGCTGCTCAAGGTCACCCACAAGGTCTGATTTTTCACAAAAAATATTTGCTTCTGGACAAGACAGAATTAGGATGAAAATGAAGAGATTACGTGAACTGGAGAACCCCTTCTAACTTGAAAATACCTGTAGTGACCACAGTCTGACTTCTCCCTCCTCACATGAACCTTTTGGGGCATTCGATGAAGGAGCAGTCACTCCCTTCCTTCCCCAGTGGGGAACAGCAACAGATTCTGGCAGGTGAGTCTGCTGCAGAAGAGACAAGTTCTTATTTCAGCTGCGTGGAGCTGTGTCTGGGGCAGGTCGTTGACTTTGTCTCCTTAGGGTAAACAGCAGAACATGGATGGTGTTTGATGCCCGCATGAGTGAATGTACTCTTATTTTTACACAGTTATTTTTGACCATAAATTGCTGGATCTGCTGTAGAGCTCTCTGCAGTCATGACACACAGCTATTGATCCACCAAAGATCTATGCTCTCCATCCAAGCTGTAGGGATGTAATTGGGAACTGGCATTTCAGGTGGGGATCACATTTCCAGCCTCTATTATGTCTAGTAGGGCCATGTGACTGAGTTATGGATAAGAAATGTGGGCGGAAGTGTTGTGTGCCCCTTCCAGGCCTCACTTCTAAGGTGTTTCCTTCTCTCCCTTCCCCAACTAGTGACTGGATGGAGATGACCCAGGAAGGGGCCCTGTTGCCCAGGAAATGGGCTTGTCCTGAACCACAGCTTGAAGGAGAGCCACCGACTGATCAGGAATACCCAACTGGACTTTATTCCAGCAACATACAAAGCATTACTGTGCTGGGCCATGGTATATTATTGGGTTTCTTTTATTAGAACACTTGGCATTACCTTCACTAATATACACTCATCATAGTAGACATTTTCACTAGTTATAGATGATATGCACTATTTTCCCTTCTGAAACAGAAATTTGCAGCAGCACTGCCAAAGGACAATAGATTTTTAAAAATCATAGAATGACTGGAGTTCATGTCTCTGCAAAGAACATCTAAGCCCTAAGCCATCCAGAGTGGATGAGGCATCTCTGCATGAGTTAAATTACACACTCCAGCTGCTGTAACCAAGAAGGAGTTTCACAGTGGTCAAAACGTCGTAGAAGTTTAGTTCTCATGCATGTAACAGTCCAAACGCAGCTCCACAGTGGCAAGGAGCCAGCGTCCTTTCTCTTGCTGTCCTGCTGTGCTCAAGAGGTGGCTTCTGTCTTTGAGTCCAACGTGGCTGCTCTGGCCCCAGCCATCATTTCTATACTCCAGCAGGTGGCAAGTGGGAAGAAGAAAGGGAGAGCTTATGCCTTTCATTTTAGGGACACATGGCCTAGTGCT' ]; \n\
}";

	var root = parseDot(dot);
	var nodes = graph(root);
	var m = [5, 35, 20, 150],
	    w = 1500 - m[1] - m[3],
	    h = 400 - m[0] - m[2];

	var div = d3.select("body").append("div");

	var chart = iobio.viz.referenceGraph()
	    .width(w + m[1] + m[3])
	    .height(h + m[0] + m[2])
	    .margin({top: m[0], right: m[1], bottom: m[2], left:m[3]})
	    .xValue(function(d) { return d.position; })
	    .yValue(function(d) { return d.y; })
	    .wValue(function(d) { return d.sequence.length })
	    .id(function(d) { return 'variant-' + d.id; })
	    .tooltip(function(d) { return d.position + ':' + d.sequence });
  
	var selection = div.datum( nodes );
	chart(selection); 
	    
    it("the id is being set on elems", function() {      
      expect(document.getElementById('variant-7')).not.toEqual(null);
    });

    it("the tooltip is being set", function() {      
      expect(typeof d3.selectAll('.node').on('mouseover')).toEqual('function');
    });
    

    describe("variant", function() {

		it("is being drawn with the right x value", function() {      
		  var bb = document.getElementById('variant-7').getBBox();
	      expect(bb.x).toEqual(86);
	    });

	    it("is being drawn with the right y value", function() {      
		  var bb = document.getElementById('variant-7').getBBox();
	      expect(bb.y).toEqual(197.5);
	    });    

	    it("is being drawn with the	right height", function() {      
		  var bb = document.getElementById('variant-7').getBBox();
	      expect(bb.height).toEqual(57.25);
	    });

	   	it("is being drawn with the right width", function() {      
		  var bb = document.getElementById('variant-7').getBBox();
	      expect(bb.width).toEqual(42);
	    });    
	})
    
});

function parseDot(text) {
  var left = undefined;
  var nodes = {};
  var curr = {};
  var lines=text.split("\n") .slice(1,text.length);
  lines.forEach(function(line) {
  	line = line.trim();
    if (line[line.length-1] != ';') {
      // ignore
    }
    // handle label
    else if (line.split('->').length == 1) {
      var fields = line.split('[');
      var nodeId = parseInt(fields[0]);
      var value = fields[1].split(/"|'/)[1];
      var pos = parseInt( value.split(' ')[0] );      
      var seq = value.split(' ')[1];  

      if (nodes[nodeId] == undefined) {
        var node = {id:nodeId, sources:[], targets:[], position:pos, sequence:seq}
        nodes[nodeId] = node;
      } else {
        nodes[nodeId].sequence = seq;
        nodes[nodeId].position = pos;
      }
    } else { // handle edge
      var fields = line.split('->');    
      var sourceId = parseInt(fields[0]);
      var targetId = parseInt(fields[1]);

      if (nodes[sourceId] != undefined)
        var source = nodes[sourceId];
      else {
        var source = {id:sourceId, sources:[], targets:[]}
        nodes[sourceId] = source;
      }

      if (nodes[targetId] != undefined)
        var target = nodes[targetId];
      else {
        var target = {id:targetId, sources:[], targets:[]}
        nodes[targetId] = target;
      }

      source.targets.push(target);
      target.sources.push(source);

      // grab first source;
      left = left || source;
    }
  })
  return left;
}