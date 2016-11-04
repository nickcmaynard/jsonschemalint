'use strict';

var app = angular.module('app', false);

app.service('markupYaml', function ($window, $q, $http) {

  var loadYaml = require('es6-promise!yamljs');

  this.parse = function (text) {
    // We wrap this in $q otherwise the digest doesn't fire correctly
    return $q.when(loadYaml()).then(function (yaml) {
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
    return $q.when(loadYaml()).then(function (yaml) {
      return yaml.stringify(obj, 4, 2);
    });
  };

});