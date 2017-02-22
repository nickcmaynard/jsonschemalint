'use strict';

// Allow ES6 in protractor tests
require('babel-register');

var SpecReporter = require('jasmine-spec-reporter').SpecReporter;

// Standard capabilities to select
var defaultCapabilities = [{
  browserName: 'chrome'
},{
  browserName: 'firefox'
}];

//jshint strict: false
var config = {

  allScriptsTimeout: 11000,

  specs: ['*.spec.js'],

  getMultiCapabilities: function() {
    // use --params.browsers='chrome,firefox' or --params.browsers='chrome' to select specific browsers
    var browsers = (this.params && this.params.browsers && this.params.browsers.split(',')) || defaultCapabilities.map((cap) => cap.browserName);
    return defaultCapabilities.filter(function(cap) {
      return browsers.indexOf(cap.browserName) != -1;
    });
  },

  baseUrl: 'http://localhost:3001/',

  framework: 'jasmine2',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000,
    print: function() {}
  },

  onPrepare: function() {
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayStacktrace: true
      }
    }));
  }

};

if (process.env.TRAVIS) {
  config.sauceUser = process.env.SAUCE_USERNAME;
  config.sauceKey = process.env.SAUCE_ACCESS_KEY;
  // In Travis, we test everything
  delete config.getMultiCapabilities;
  config.multiCapabilities = [
    {
      'browserName': 'chrome',
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      'build': process.env.TRAVIS_BUILD_NUMBER
    }, {
      'browserName': 'firefox',
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      'build': process.env.TRAVIS_BUILD_NUMBER
    }
  ];
}

exports.config = config;