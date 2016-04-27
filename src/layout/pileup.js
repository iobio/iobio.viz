

var pileup = function() {
  // Defaults
  var startValue = function(d) { return d.start; },
      endValue = function(d) { return d.end; },
      sort = 'default',
      size = 400,
      buffer = 0;

  function layout(data) {

    // Compute the numeric values for each data element.
    var values = data.map(function(d, i) { return [+startValue.call(layout, d, i),+endValue.call(layout, d, i)]; });
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
    var piles = [];
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

      for ( var k=0; k < furthestRight.length; k++) {
        if ( (xScale(furthestRight[k])+buffer) < xScale(start) ) {
          step = k;
          furthestRight[k] = end;
          break;
        }
      }

      if (step == undefined) { step = furthestRight.length; furthestRight.push(end) }

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