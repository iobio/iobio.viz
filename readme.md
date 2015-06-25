# iobio.viz [![Build Status](https://travis-ci.org/iobio/iobio.viz.svg?branch=master)](https://travis-ci.org/iobio/iobio.viz) [![Coverage Status](https://coveralls.io/repos/iobio/iobio.viz/badge.svg?branch=master)](https://coveralls.io/r/iobio/iobio.viz?branch=master)
Handles the websocket code and makes creating iobio commands easier.

## Use

### TODO

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