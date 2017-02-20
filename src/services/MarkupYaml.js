'use strict';

var app = angular.module('app', false);

app.service('markupYaml', function ($window, $q, alertService, $log) {

  var yaml;

  var _setupPromise;
  var setup = function() {
    return _setupPromise || (_setupPromise = $q(function(resolve, reject) {
      try {
        require.ensure([], function(require) {
          yaml = require('yamljs');
          resolve(true);
        });
      } catch (error) {
        $log.error("Could not load yamljs", error);
        alertService.alert({
          title: "Could not load module",
          message: "We couldn't load a vital part of the application.  This is probably due to network conditions.  We recommend reloading the page once conditions improve."
        });
        reject(error);
      }
    }));
  };

  this.parse = function (text) {
    return setup().then(function () {
      try {
        var obj = yaml.parse(text);
        return obj;
      } catch (err) {
        throw [{
          message: "Document is invalid YAML."
        }];
      }
    });
  };

  this.prettyPrint = function (obj) {
    // We wrap this in $q otherwise the digest doesn't fire correctly
    return setup().then(function () {
      return yaml.stringify(obj, 4, 2);
    });
  };

});