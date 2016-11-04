'use strict';

var app = angular.module('app', false);

// Handles draft-04, draft-05
app.factory('validatorFactoryAJV', function ($window, $q) {

  var Validator = function (version) {
    // Initially unset for lazy-loading
    var validator;

    var setup = function () {
      if (validator) {
        return $q.when(true);
      } else {
        var loadAjv = require('es6-promise!ajv');
        // We wrap this in $q otherwise the digest doesn't fire correctly
        return $q.when(loadAjv()).then(function (ajv) {
          validator = ajv({
            verbose: true,
            allErrors: true,
            //
            // VERSION DETERMINATION LOGIC
            //
            v5: version === "draft-05"
          });
          return true;
        });
      }
    };

    this.validateSchema = function (schemaObject) {
      return setup().then(function () {
        if (validator.validateSchema(schemaObject)) {
          return true;
        } else {
          console.error(validator.errorsText(validator.errors));
          throw validator.errors;
        }
      });
    };

    this.validate = function (schemaObject, documentObject) {
      return setup().then(function () {
        if (validator.validate(schemaObject, documentObject)) {
          return true;
        } else {
          console.error(validator.errorsText(validator.errors));
          throw validator.errors;
        }
      });
    };
  };

  // Factory for JSV validators
  return function (version) {
    return new Validator(version);
  };

});