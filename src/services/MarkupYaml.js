'use strict';

var app = angular.module('app', false);

app.service('markupYaml', function ($window, $q, $http) {

  var yaml = require('yamljs');

  this.parse = function (text) {
    return $q(angular.bind(this, function (resolve, reject) {
      try {
        var obj = yaml.parse(text);
        resolve(obj);
      } catch (err) {
        reject([{
          message: "Document is invalid YAML."
        }]);
      }
    }));
  };

  this.prettyPrint = function(obj) {
    return yaml.stringify(obj, 4, 2);
  }

});