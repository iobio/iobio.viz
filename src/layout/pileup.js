

var pileup = function() {
  // Defaults
  var start = function(d) { return d.start; },
      end = function(d) { return d.end; },    
      sort = 'default',
      size = 400,
      buffer = 0;

  function layout(data) {

    // Compute the numeric values for each data element.
    var values = data.map(function(d, i) { return [+start.call(layout, d, i),+end.call(layout, d, i)]; });
    var xScale = d3.scale.linear()
            .domain( [values[0][0], values[values.length-1][1]] )
            .range([0, size]);

    // Optionally sort the data.
    var index = d3.range(data.length);
    if (sort != null) index.sort(sort === 'default'
        ? function(i, j) { return values[j][0] - values[i][0]; }
        : function(i, j) { return sort(data[i], data[j]); });

    // Compute the piles!
    // They are stored in the original data's order.
    // TODO: handle widhts that are less than a pixel
    var step;
    // var bottomEnd = undefined;
    var piles = [];
    // var ppEnd = []; // previous pile end    
    // var ppCurrStep;
    // var ppLastStep = [];
    // var freeSpots = [ {pos:-1,step:0,index:null}, {pos:null,step:null,index:null}, {pos:null,step:null,index:null} ] ;

    var furthestRight = [];

    // initialize piles
    var currPile = [];
    var prevPile = [];
    var prevPrevPile = [];

    // initialize indices
    var prevPileIndex = 1;

    index.forEach(function(i) { 
      var start = values[i][0];      
      var end = values[i][1];
      step = undefined;

      if( data[i].id == 'HSQ1004:134:C0D8DACXX:1:1201:13648:213371') {
        var h = 5;
      }

      for ( var k=0; k < furthestRight.length; k++) {
        if ( (xScale(furthestRight[k])+buffer) < xScale(start) ) {
          step = k;
          furthestRight[k] = end;
          break;
        }
      }

      if (step == undefined) { step = furthestRight.length; furthestRight.push(end) }
  
      
      // if ( currPile.length==0 || (xScale(currPile[0])+buffer) < xScale(start) ) { // check if you can start a new pile
      //   step = 0;        
        
      //   // move piles up
      //   prevPrevPile = prevPile;
      //   prevPile = currPile;
      //   currPile = [end];

      //   // reset indices
      //   prevPileIndex = 1;

      // } else if ( prevPile.length <= prevPileIndex || (xScale(prevPile[prevPileIndex])+buffer) < xScale(start) )  { // if not, check if you can place in current pile        
      //   step = currPile.length;
      //   currPile.push(end);
      //   prevPileIndex += 1; // update prevPile Index
      // // } else if ( prevPrevPile.length <= prevPile.length || (xScale(prevPrevPile[prevPile.length])+buffer) < xScale(start) )  { // if not, check if you can place in previous pile        
      //   } else if ( prevPrevPile.length <= prevPile.length || (xScale(prevPrevPile[prevPile.length])+buffer) < xScale(start) )  { // if not, check if you can place in previous pile        
      //   step = prevPile.length;
      //   prevPile.push(end);
      // } else  { // if not, assume you can place in pile before previous pile
      //   step = prevPrevPile.length;
      //   prevPrevPile.push(end);        
      // }



      // if (i > 0 && data[i+1].id == 'HSQ1004:134:C0D8DACXX:2:1201:11823:1436240') {        
      // if (data[i+1].id == 'HSQ1004:134:C0D8DACXX:1:1306:2425:1181500') {        
      //   console.log('h');
      //   var h = 5;
      // }
      // if ( bottomEnd != undefined && ((xScale(bottomEnd)+buffer) >= xScale(start)) ) {
      //   if (ppEnd[ppCurrStep] != undefined && (xScale(start) <= (xScale(ppEnd[ppCurrStep])+buffer))) {
      //     for(var i=0; i < ppLastStep.length; i++) {
      //       if (start > ppLastStep[i]) {
      //         ppLastStep[i] += 1;
      //         step = ppLastStep[i];
      //         ppEnd[step] = end;
      //         break;
      //       }
      //     }
      //   } else {
      //     step = ppCurrStep || step+1;
      //     ppCurrStep = step+1;
      //     ppEnd[step] = end;
      //   }
      // }
      // else {
      //   ppLastStep.push(step);
      //   step = 0;
      //   ppCurrStep = 1;
      //   bottomEnd = end;
      // }       
      piles[i] = {
        data: data[i],
        x: start,
        w: end-start,
        y: step
      };      
    });
    return piles;
  }

  /*
   * Specifies the value function *start*, which returns a nonnegative numeric value
   * for each datum. The default value function is `return start`. The value function
   * is passed two arguments: the current datum and the current index.
   */
  layout.start = function(_) {
    if (!arguments.length) return startValue;
    startValue = _;
    return layout;
  };

  /*
   * Specifies the value function *end*, which returns a nonnegative numeric value
   * for each datum. The default value function is `return end`. The value function
   * is passed two arguments: the current datum and the current index.
   */
  layout.end = function(_) {
    if (!arguments.length) return endValue;
    endValue = _;
    return layout;
  };

  /*
   * Specifies the x scale for the layout. This is necessary to accurately predict
   * which features will overlap in pixel space.
   */
  layout.size = function(_) {
    if (!arguments.length) return size;
    size = _;
    return layout;
  };

  /*
   * Specifies the buffer needed between features to not be considered an overlap   
   */
  layout.buffer = function(_) {
    if (!arguments.length) return buffer;
    buffer = _;
    return layout;
  };

  /*
   * Specifies the sort function to be used or null if no sort   
   */
  layout.sort = function(_) {
    if (!arguments.length) return sort;
    sort = _;
    return layout;
  };

  return layout;
};

module.exports = pileup;