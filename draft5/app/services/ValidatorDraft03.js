'use strict';

var app = angular.module('app', false);

app.service('validatorDraft03', function ($window, $q, $http) {

  // Use JSV with draft3 environment
  var jsv = $window['jsv'].JSV;
  var validator = JSV.createEnvironment("json-schema-draft-03");

  var schemaSchema = validator.getDefaultSchema();

  this.validateSchema = function (schemaObject) {
    return $q(angular.bind(this, function (resolve, reject) {
      var results = validator.validate(schemaObject, schemaSchema);
      if (!results.errors || !results.errors.length) {
        resolve(true);
      } else {
        reject(results.errors.map(this._mapError));
      }
    }));
  };

  this.validate = function (schemaObject, documentObject) {
    return $q(angular.bind(this, function (resolve, reject) {
      var results = validator.validate(documentObject, schemaObject);;
      if (!results.errors || !results.errors.length) {
        resolve(true);
      } else {
        reject(results.errors.map(this._mapError));
      }
    }));
  };

  // Convert JSV errors into something the tables understand
  this._mapError = function(e) {
    var field = e.uri.substring(e.uri.indexOf('#') + 1);
    return {
      dataPath: field,
      message: e.message,
      data: e.details.length ? e.details[0] : ""
    }
  };

});