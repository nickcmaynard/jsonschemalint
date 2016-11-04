'use strict';

var app = angular.module('app', false);

app.service('validatorDraft02', function ($window, $q, $http) {

  // Initially unset for lazy-loading
  var validator;
  var schemaSchema;

  this.validateSchema = function (schemaObject) {
    return this._setup().then(angular.bind(this, $q, function (resolve, reject) {
      var results = validator.validate(schemaObject, schemaSchema);
      if (!results.errors || !results.errors.length) {
        resolve(true);
      } else {
        reject(results.errors.map(this._mapError));
      }
    }));
  };

  this.validate = function (schemaObject, documentObject) {
    return this._setup().then(angular.bind(this, $q, function (resolve, reject) {
      var results = validator.validate(documentObject, schemaObject);;
      if (!results.errors || !results.errors.length) {
        resolve(true);
      } else {
        reject(results.errors.map(this._mapError));
      }
    }));
  };

  this._setup = function() {
    return $q(angular.bind(this, function(resolve, reject) {
      if (validator) {
        // Already set up
        resolve(true);
      } else {
        // Go ahead and set up the validator
        require.ensure(['JSV'], function(require) {
          var jsv = require('JSV').JSV;
          validator = jsv.createEnvironment("json-schema-draft-02");
          schemaSchema = validator.getDefaultSchema();
          resolve(true);
        });
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