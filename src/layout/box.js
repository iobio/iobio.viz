

var box = function() {
  // Defaults
  var value = function(d) { return +d },
      quartiles = function(d) { return [d3.quantile(d, .25),d3.quantile(d, .5),d3.quantile(d, .75)]; },
      whiskers = function(d) { return [0, d.length - 1]; },
      includeData = true,
      includeOutliers = true,
      modifiedBoxPlot = true;

  function layout(data) {

    // Sort data and Compute the numeric values for each data element.
    data = data.sort(function(i,j) { return value(j) - value(i); })
    var values = data.map(function(d, i) { return value.call(this,d,i) });

    // Compute quartiles
    var quartileData = quartiles.call(this,values),
        q1 = quartileData[2],
        q3 = quartileData[0],
        iqr = (q3-q1) * 1.5;

    // if modified box plot, then use iqr to determine outliers
    if(modifiedBoxPlot) {
        var outliers = [];
        var filtered = [];
        values.forEach(function(d) {
            if ( d>=(q1-iqr) && d <=(q3+iqr) )
                filtered.push(d);
            else
                outliers.push(d);
        })
        values = filtered;
    }

    // Compute whiskers. Must return exactly 2 elements, or null.
    var whiskerIndices = whiskers && whiskers.call(this, values),
        whiskerData = whiskerIndices && whiskerIndices.map(function(i) { return +values[i]; });

    var boxData = {
        'quartiles' : quartileData,
        'whiskers' : whiskerData
    };
    if (includeOutliers) boxData.outliers = outliers || [];
    if (includeData) boxData.data = data;

    return boxData;
  }

  /*
   * Specifies the value function, which returns a nonnegative numeric value
   * for each datum. The default value function is `return d`. The value function
   * is passed two arguments: the current datum and the current index.
   */
  layout.value = function(_) {
    if (!arguments.length) return value;
    value = _;
    return layout;
  };

  /*
   * Boolean for including the data in the final product or not
   */
  layout.includeData = function(_) {
    if (!arguments.length) return includeData;
    includeData = _;
    return layout;
  };

  /*
   * Boolean for including the outliers in the final product or not
   */
  layout.includeOutliers = function(_) {
    if (!arguments.length) return includeOutliers;
    includeOutliers = _;
    return layout;
  };

  /*
   * A modified box plot uses the interquartile range to determine the whisers.
   * A standard box plot defines the whiskers by the max and min value.
   * Default: true
   */
  layout.modifiedBoxPlot = function(_) {
    if (!arguments.length) return modifiedBoxPlot;
    modifiedBoxPlot = _;
    return layout;
  };

  /*
   * Specifies how the quartiles are calculated
   *
   */
  layout.quartiles = function(_) {
    if (!arguments.length) return quartiles;
    quartiles = _;
    return layout;
  };

  return layout;
};

module.exports = box;