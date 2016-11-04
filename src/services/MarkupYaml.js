'use strict';

var app = angular.module('app', false);

app.service('markupYaml', function ($window, $q, $http) {

  var yaml;

  this.parse = function (text) {
    return this._setup().then(angular.bind(this, $q, function (resolve, reject) {
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
    return this._setup().then(function() {
      return yaml.stringify(obj, 4, 2);
    });
  }

  this._setup = function() {
    return $q(function(resolve, reject) {
      // Lazy-load YAML via chunking
      require.ensure(['yamljs'], function(require) {
        yaml = require('yamljs');
        resolve(true);
      });
    });
  }

});