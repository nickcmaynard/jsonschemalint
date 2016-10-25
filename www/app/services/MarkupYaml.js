'use strict';

var app = angular.module('app', false);

app.service('markupYaml', function ($window, $q, $http) {

  var YAML = $window['YAML'];

  this.parse = function (text) {
    return $q(angular.bind(this, function (resolve, reject) {
      try {
        var obj = YAML.parse(text);
        resolve(obj);
      } catch (err) {
        reject([{
          message: "Document is invalid YAML."
        }]);
      }
    }));
  };

  this.prettyPrint = function(obj) {
    return YAML.stringify(obj, 4, 2);
  }

});