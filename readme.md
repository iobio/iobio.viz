# iobio.viz [![Build Status](https://travis-ci.org/iobio/iobio.viz.svg?branch=master)](https://travis-ci.org/iobio/iobio.viz) [![Coverage Status](https://coveralls.io/repos/iobio/iobio.viz/badge.svg?branch=master)](https://coveralls.io/r/iobio/iobio.viz?branch=master)
Visualization and charting JS library for streaming genomic data

## Base Attributes
These features are present on every chart

**margin** -  the offsets of the chart. often used for scales 
```JavaScript
  var chart = iobio.viz.bar()
    .margin( {top: m[0], right: m[1], bottom: m[2], left:m[3]} )
```

**width** -  the width of the chart 
```JavaScript
  var chart = iobio.viz.bar()
    .width( 500 )
```
	
**height** -  the height of the chart
```JavaScript
  var chart = iobio.viz.bar()
    .height( 600 )
```
	
**x** - the x scale of the chart. This is d3 scale object. See [scales](https://github.com/mbostock/d3/wiki/Scales) for full options
```JavaScript
  chart.x().range();
```
	
**y** - the y scale of the chart. This is d3 scale object. See [scales](https://github.com/mbostock/d3/wiki/Scales) for full options
```JavaScript
  chart.y().domain();
```
	
**xValue** - the x value accessor. Sets the x location for charts with glyphs placed on the x,y axis
```JavaScript
  var chart = iobio.viz.bar()
    .xValue( function(d) { return d.pos; } )
```
	
**yValue** - the y value accessor. Sets the y location for glyphs placed on the x,y axis
```JavaScript
  var chart = iobio.viz.bar()
    .yValue( function(d) { return d.count; } )
```
	
**wValue** - the w value accessor. Sets the width of the glyph
```JavaScript
  var chart = iobio.viz.bar()
    .wValue( function(d) { return d.sequence.length; } )
```
	
**id** - the id value accessor. Sets the html id attribute value
```JavaScript
  var chart = iobio.viz.bar()
    .id( function(d) { return 'read-' + d.name; } )
```
	
**xAxis** - the x axis. This is d3 axis object. See [axes](https://github.com/mbostock/d3/wiki/SVG-Axes) for full options
```JavaScript
  chart.xAxis().orient('bottom');    
```

**yAxis** - the y axis. This is d3 axis object. See [axes](https://github.com/mbostock/d3/wiki/SVG-Axes) for full options
```JavaScript
  chart.yAxis().ticks(10);
```
	
**preserveAspectRatio**
	
**getBoundingClientRect** - returns bounding client for chart
	
**transitionDuration** - the duration of the standard transitions
	
**color** - the color of the default glyphs
	
**brush** - 
	
**onChart** - set events on the entire chart

**tooltipChart** - set tooltips on the entire chart

## Alignment Visualization

## Gene Model Visualization

## Bar Visualization

## Bar Viewer Visualization

## Pie Visualization

## Line Visualization

## Developers

#### Download 
To get going you need to clone the repo from github
```
git clone https://github.com/iobio/iobio.viz.git
```

#### Install Dependencies
This will install all needed node modules
```
cd iobio.viz; npm install
```


#### Build JS
This will create a single development js file from everything in the ```src``` directory with sourcemaps for debugging.
```
gulp js-debug
```

This will create a single minified js file (ready for production) from everything in the ```src``` directory.
```
gulp js
```

#### Build CSS
This will create a single minified css file (ready for production) from everything in the ```src/css``` directory.
```
gulp css
```

#### Run tests
Runs all tests found in the ```test``` directory
```
gulp test
```