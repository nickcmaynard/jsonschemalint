var SpecReporter = require('jasmine-spec-reporter').SpecReporter;

//jshint strict: false
exports.config = {

  allScriptsTimeout: 11000,

  specs: ['*.spec.js'],

  multiCapabilities: [{
    browserName: 'chrome'
  }, {
    browserName: 'firefox'
  }],

  baseUrl: 'http://localhost:3001/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  },

  onPrepare: function () {
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayStacktrace: true
      }
    }));
  }

};