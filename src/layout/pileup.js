

var pileup = function() {
  var startValue = function(d) { return d.start; },
      endValue = function(d) { return d.end; },    
      sort = 'default',
      size = 400,
      buffer = 0;

  function pileup(data) {

    // Compute the numeric values for each data element.
    var values = data.map(function(d, i) { return [+startValue.call(pileup, d, i),+endValue.call(pileup, d, i)]; });
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
    var step = 0;
    var bottomEnd = undefined;
    var piles = [];
    index.forEach(function(i) { 
      var start = values[i][0]      
      var end = values[i][1];
      if ( bottomEnd != undefined && ((xScale(bottomEnd)+buffer) >= xScale(start)) )
        step += 1;
      else {
        step = 0;
        bottomEnd = end;
      }       
      piles[i] = {
        data: data[i],
        x: start,
        w: end-start,
        y: step
      };      
    });
    return piles;
  }

  /**
   * Specifies the value function *x*, which returns a nonnegative numeric value
   * for each datum. The default value function is `return x`. The value function
   * is passed two arguments: the current datum and the current index.
   */
  pileup.startValue = function(_) {
    if (!arguments.length) return startValue;
    startValue = _;
    return pileup;
  };

  /**
   * Specifies the value function *x*, which returns a nonnegative numeric value
   * for each datum. The default value function is `return length`. The value function
   * is passed two arguments: the current datum and the current index.
   */
  pileup.endValue = function(_) {
    if (!arguments.length) return endValue;
    endValue = _;
    return pileup;
  };

  /**
   * Specifies the x scale for the layout. This is necessary to accurately predict
   * which features will overlap
   */
  pileup.size = function(_) {
    if (!arguments.length) return size;
    size = _;
    return pileup;
  };

  /**
   * Specifies the buffer needed between features to not be considered an overlap   
   */
  pileup.buffer = function(_) {
    if (!arguments.length) return buffer;
    buffer = _;
    return pileup;
  };

  /**
   * Specifies the sort function to be used or null if no sort   
   */
  pileup.sort = function(_) {
    if (!arguments.length) return sort;
    sort = _;
    return pileup;
  };

  return pileup;
};

module.exports = pileup;