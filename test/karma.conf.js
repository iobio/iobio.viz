// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html

var cover = require('browserify-istanbul');

var coverOptions = {
  ignore: ['test/**/*.js'],
  defaultIgnore: true
}

module.exports = function(config) {
  'use strict';

  config.set({
    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine', 'browserify'],


    preprocessors: {
      'test/**/*.js': [ 'browserify' ],
      'src/**/*.js': [ 'browserify' ]
    },

    // generate results in lcov format for coveralls
    coverageReporter: {
      type: 'lcov', // lcov or lcovonly are required for generating lcov.info files
      dir: 'test/coverage/'
    },

    // browserify configuration
    browserify: {
      debug: true,
      transform: [ 'brfs', cover(coverOptions) ]
    },

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // list of files / patterns to load in the browser
    files: [
      'test/**/*.js',
      'src/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 9876,

    //A list of reporters to use.
    reporters: [ 'dots', 'coverage' ],

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome', 'Firefox'],

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,
    
  });
};
