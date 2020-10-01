'use strict';

// Allow ES6 in protractor tests
require('babel-register');

// Dotenv
require('dotenv').config()

var SpecReporter = require('jasmine-spec-reporter').SpecReporter;

// Standard capabilities to select
var defaultCapabilities = [{
  browserName: 'chrome'
},{
  browserName: 'firefox'
}];

// Sauce Connect
const useSauce = process.env.USE_SAUCE || process.env.TRAVIS;
// Keep track
let sauceConnectProcess;
// Tunnel identifier
const sauceTunnelId = useSauce ? (process.env.TRAVIS_JOB_NUMBER || 'cli-e2e') : undefined;

//jshint strict: false
var config = {

  allScriptsTimeout: 20000,

  specs: ['*.spec.js'],
  
  // Only resolves if environment is actually set up
  sauceUser: useSauce ? process.env.SAUCE_USERNAME : undefined,
  sauceKey: useSauce ? process.env.SAUCE_ACCESS_KEY : undefined,

  getMultiCapabilities: function() {
    // use --params.browsers='chrome,firefox' or --params.browsers='chrome' to select specific browsers
    var browsers = (this.params && this.params.browsers && this.params.browsers.split(',')) || defaultCapabilities.map((cap) => cap.browserName);
    let capabilities = defaultCapabilities.filter(function(cap) {
      return browsers.indexOf(cap.browserName) != -1;
    });
    
    if (useSauce) {
      // In Travis, we test everything, so update the capabilities array
      capabilities = [
        {
          'browserName': 'chrome',
          'version': 'latest',
          'tunnel-identifier': sauceTunnelId,
          'build': process.env.TRAVIS_BUILD_NUMBER
        }, {
          'browserName': 'firefox',
          'version': 'latest',
          'tunnel-identifier': sauceTunnelId,
          'build': process.env.TRAVIS_BUILD_NUMBER
        }, {
          'browserName': 'MicrosoftEdge',
          'version': 'latest',
          'platform': 'Windows 10',
          'tunnel-identifier': sauceTunnelId,
          'build': process.env.TRAVIS_BUILD_NUMBER
        }, 
        {
          'browserName': 'internet explorer',
          'version': 'latest',
          'platform': 'Windows 10',

          // IE11 just doesn't play nice.  Just run smoke tests
          'exclude': ['data.spec.js','samples.spec.js', 'interaction.spec.js'],

          'tunnel-identifier': sauceTunnelId,
          'build': process.env.TRAVIS_BUILD_NUMBER
        }
      ];

      // Launch Sauce Connect
      const SauceLabs = require('saucelabs').default;
      const account = new SauceLabs();
      console.info('Launching Sauce Connect...');
      return account.startSauceConnect({
          tunnelIdentifier: sauceTunnelId
      }).then(process => {
        console.info('...launched Sauce Connect.');
        // Keep track
        sauceConnectProcess = process;
      }).then(() => {
        // Capabilities for testing remotely
        return capabilities;
      });
    } else {
      // Capabilities for testing locally
      return capabilities;
    }
  },

  baseUrl: process.env.LIVE ? 'https://jsonschemalint.com' : 'http://localhost:3001/',

  framework: 'jasmine2',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 60000,
    print: function() {}
  },

  onPrepare: function() {
    browser.driver.manage().window().setSize(1024, 700);
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayStacktrace: true
      }
    }));
  },
  
  afterLaunch: function() {
    if (sauceConnectProcess) {
      // Clean up Sauce Connect
      console.info('Closing Sauce Connect...');
      // eslint-disable-next-line
      const p = sauceConnectProcess.close();
      p.then(() => {
        console.info('...closed Sauce Connect.');
      });
      return p;
    }
  }

};

exports.config = config;
