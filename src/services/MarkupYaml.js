'use strict';

var app = angular.module('app', false);

app.service('markupYaml', function ($window, $q, alertService) {

  var yaml;

  var _setupPromise;
  var setup = function() {
    // We wrap this in $q otherwise the digest doesn't fire correctly
    return _setupPromise || (_setupPromise = $q.when(require('async-module?promise!yamljs')).then(function(_yaml) {
      yaml = _yaml;
      return yaml;
    }).catch(function(error) {
      console.error("Could not load yamljs", error);
      alertService.alert({
        title: "Could not load module",
        message: "We couldn't load a vital part of the application.  This is probably due to network conditions.  We recommend reloading the page once conditions improve."
      });
      throw error;
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