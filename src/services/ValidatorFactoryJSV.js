'use strict';

var app = angular.module('app', false);

// Handles draft-01, draft-02, draft-03
app.factory('validatorFactoryJSV', function ($window, $q) {

  var Validator = function (version) {
    // Initially unset for lazy-loading
    var validator;
    var schemaSchema;

    var setup = function () {
      if (validator) {
        return $q.when(true);
      } else {
        var loadJSV = require('es6-promise!JSV');
        // We wrap this in $q otherwise the digest doesn't fire correctly
        return $q.when(loadJSV()).then(function (JSV) {
          var jsv = JSV.JSV;
          //
          // VERSION DETERMINATION LOGIC
          //
          validator = jsv.createEnvironment("json-schema-" + version);
          schemaSchema = validator.getDefaultSchema();
          return true;
        });
      }
    };

    // Convert JSV errors into something the tables understand
    var mapError = function (e) {
      var field = e.uri.substring(e.uri.indexOf('#') + 1);
      return {
        dataPath: field,
        message: e.message,
        data: e.details.length ? e.details[0] : ""
      };
    };

    this.validateSchema = function (schemaObject) {
      return setup().then(angular.bind(this, function () {
        var results = validator.validate(schemaObject, schemaSchema);
        if (!results.errors || !results.errors.length) {
          return true;
        } else {
          throw results.errors.map(mapError);
        }
      }));
    };

    this.validate = function (schemaObject, documentObject) {
      return setup().then(angular.bind(this, function () {
        var results = validator.validate(documentObject, schemaObject);
        if (!results.errors || !results.errors.length) {
          return true;
        } else {
          throw results.errors.map(mapError);
        }
      }));
    };
  };

  // Factory for JSV validators
  return function (version) {
    return new Validator(version);
  };

});