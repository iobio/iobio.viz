var variant = function() { 
    
    // Value transformers
    var xValue = function(d) { return d.x; },
        yValue = function(d) { return d.y; },
        wValue = function(d) { return d.w; },
        hValue = function(d) { return d.h; };

    var diagonal = d3.svg.diagonal()        

    function shape(d, i) {    
        diagonal
            .source(function(d) { return {"x":hValue(d)*d.y, "y":d.x+Math.abs(d.w/2)}; })            
            .target(function(d) { return {"x":0, "y":d.x+d.w/2+Math.abs(d.w/2)}; })
            .projection(function(d) { return [d.y, d.x]; });
        
        var variantH = hValue(d);
        var bulbW = Math.abs(variantH * 5/6);
        // Create control points
        var c1 = variantH * 1/6+yValue(d),
            c2 = variantH*2/6+yValue(d),
            c3 = variantH*0.625+yValue(d),
            c4 = variantH*1.145+yValue(d);

        if (wValue(d) <= Math.abs(bulbW/2))
            return "M" +xValue(d)+","+yValue(d)+" C" +xValue(d)+ "," +c1+" "+parseInt(xValue(d)+wValue(d)/2-bulbW/2)+ "," +c2+" "+parseInt(xValue(d)+wValue(d)/2-bulbW/2)+ "," +c3+" C" +parseInt(xValue(d)+wValue(d)/2-bulbW/2)+ "," +c4+" "+parseInt(xValue(d)+wValue(d)/2+bulbW/2)+ "," +c4+" "+parseInt(xValue(d)+wValue(d)/2+bulbW/2)+ "," +c3+" C" +parseInt(xValue(d)+wValue(d)/2+bulbW/2)+ "," +c2+" "+parseInt(xValue(d)+wValue(d))+"," +c1+" "+parseInt(xValue(d)+wValue(d))+","+yValue(d);            
        else
            return diagonal(d)+diagonal({x:xValue(d), y:yValue(d), w:-wValue(d)});
    }

    /*
     * Specifies the value function *x*, which returns an integer for each datum
     * The value function is passed two arguments: the current datum and the current index.
     */  
    shape.xValue = function(_) {
        if (!arguments.length) return xValue;
        xValue = _;
        return shape;
    }

    /*
     * Specifies the value function *y*, which returns an integer for each datum
     * The value function is passed two arguments: the current datum and the current index.
     */  
    shape.yValue = function(_) {
        if (!arguments.length) return yValue;
        yValue = _;
        return shape;
    };

    /*
     * Specifies the value function *width*, which returns an integer for each datum
     * The value function is passed two arguments: the current datum and the current index.
     */  
    shape.wValue = function(_) {
        if (!arguments.length) return wValue;
        wValue = _;
        return shape;
    }; 

    /*
     * Specifies the value function *height*, which returns an integer for each datum
     * The value function is passed two arguments: the current datum and the current index.
     */  
    shape.hValue = function(_) {
        if (!arguments.length) return hValue;
        hValue = _;
        return shape;
    }; 

    return shape;
};

module.exports = variant;