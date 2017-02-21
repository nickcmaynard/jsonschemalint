'use strict';

// Allow ES6 in protractor tests
require('babel-register');

var SpecReporter = require('jasmine-spec-reporter').SpecReporter;

//jshint strict: false
exports.config = {

  allScriptsTimeout: 11000,

  specs: ['*.spec.js'],

  capabilities: {
    // We probably want to connect up Sauce Labs at some point
    browserName: 'chrome'
  },

  baseUrl: 'http://localhost:3001/',

  framework: 'jasmine2',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000,
    print: function () {}
  },

  onPrepare: function () {
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayStacktrace: true
      }
    }));
  }

};