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
          message_tid: 'ERROR_INVALID_JSON'
        }]);
      }
    });
  };

  this.prettyPrint = function(obj) {
    return $q.when(JSON.stringify(obj, null, '  '));
  };

});