import * as d3 from 'd3';

var outlier = function() {
  // Defaults
  var value = function(d) { return d[0]; },
      count = function(d) { return d[1]; };

  function layout(data) {
    var realMin = d3.min(data, function(d,i) {
      return value(d);
    });
    var realMax = d3.max(data, function(d,i) {
      return value(d);
    });
    var max = Math.abs(realMin) + Math.abs(realMax);

    var scale  = d3.scaleLinear().domain([realMin,realMax]).range([0,max]);

    data = data.sort(function(aItem,bItem) {
      var a = value(aItem);
      var b = value(bItem);
      return a > b ? 1 : (a < b ? -1 : 0);
    })

    var q1 = quantile(data, scale, 0.25); 
    var q3 = quantile(data, scale, 0.75);
    var iqr = (q3-q1) * 1.5; //
    
    var filteredData = data.filter(function(d) { 
      return (scale(value(d)) >= (Math.max(q1-iqr,0)) && scale(value(d)) <= (q3+iqr)); 
    });

    return filteredData;  
  }

  /*
   * Determines quantile of array with given p
   */
  function quantile(arr, scale, p) {
    var length = arr.reduce(function(previousValue, currentValue, index, array){
       return previousValue + count(currentValue);
    }, 0) - 1;
    var H = length * p + 1, 
    h = Math.floor(H);

    var hValue, hMinus1Value, currValue = 0;
    for (var i=0; i < arr.length; i++) {
       currValue += count(arr[i]);
       if (hMinus1Value == undefined && currValue >= (h-1))
          hMinus1Value = scale(value(arr[i]));
       if (hValue == undefined && currValue >= h) {
          hValue = scale(value(arr[i]));
          break;
       }
    } 
    var v = +hMinus1Value, e = H - h;
    return e ? v + e * (hValue - v) : v;
  } 

  /*
   * Specifies the value function *value*, which returns a nonnegative numeric value
   * for each datum. The default value function is `return d[0]`. The value function
   * is passed two arguments: the current datum and the current index.
   */
  layout.value = function(_) {
    if (!arguments.length) return value;
    value = _;
    return layout;
  };

  /*
   * Specifies the value function *count*, which returns a nonnegative numeric value
   * for each datum. The default value function is `return d[1]`. The value function
   * is passed two arguments: the current datum and the current index.
   */
  layout.count = function(_) {
    if (!arguments.length) return count;
    count = _;
    return layout;
  };  

  return layout;
};

export {
  outlier,
};
