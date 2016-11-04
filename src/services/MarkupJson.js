'use strict';

var app = angular.module('app', false);

app.service('markupJson', function ($q) {

  this.parse = function (text) {
    return $q(function (resolve, reject) {
      try {
        var obj = JSON.parse(text);
        resolve(obj);
      } catch (err) {
        reject([{
          message: "Document is invalid JSON. Try http://jsonlint.com to fix it."
        }]);
      }
    });
  };

  this.prettyPrint = function(obj) {
    return JSON.stringify(obj, null, '  ');
  };

});