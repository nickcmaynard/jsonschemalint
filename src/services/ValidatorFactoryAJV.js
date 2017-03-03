'use strict';

var app = angular.module('app', false);

// Handles draft-04, v5-unofficial
app.factory('validatorFactoryAJV', function ($window, $q, alertService, $log) {

  var Validator = function (version) {
    // Initially unset for lazy-loading
    var validator;

    var _setupPromise;
    var setup = function () {
      return _setupPromise || (_setupPromise = $q(function(resolve, reject) {
        try {
          require.ensure([], function(require) {
            var ajv = require('ajv');
            $log.debug("ValidatorFactoryAJV.setup()", "Loaded AJV");
            validator = ajv({
              verbose: true,
              allErrors: true,
              //
              // VERSION DETERMINATION LOGIC
              //
              v5: version === "v5-unofficial"
            });
            resolve(true);
          });
        } catch (error) {
          $log.error("ValidatorFactoryAJV.setup()", "Could not load AJV", error);
          alertService.alert({
            title: "{{ 'ERROR_MODULE_LOADING_FAILED_TITLE' | translate }}",
            message: "{{ 'ERROR_MODULE_LOADING_FAILED_CONTENT' | translate }}"
          });
          reject(error);
        }
      }));
    };

    this.validateSchema = function (schemaObject) {
      $log.debug("ValidatorFactoryAJV.validateSchema()");
      return setup().then(function () {
        if (validator.validateSchema(schemaObject)) {
          $log.debug("ValidatorFactoryAJV.validateSchema()", validator.errorsText(validator.errors));
          return true;
        } else {
          $log.debug("ValidatorFactoryAJV.validateSchema()", validator.errorsText(validator.errors));
          throw validator.errors;
        }
      });
    };

    this.validate = function (schemaObject, documentObject) {
      $log.debug("ValidatorFactoryAJV.validate()");
      return setup().then(function () {
        var result;
        try {
          result = validator.validate(schemaObject, documentObject);
        } catch (e) {
          // Some errors are thrown by Ajv, not wrapped up in its nice validator.errors interface
          $log.error("ValidatorFactoryAJV.validate()", e.message);
          // Wrap the exception into our standard format
          throw [{ message: e.message }];
        }
        // Validation completed - check the results
        if(result) {
          $log.debug("ValidatorFactoryAJV.validate()", "success");
          return true;
        } else {
          $log.error("ValidatorFactoryAJV.validate()", validator.errorsText(validator.errors));
          throw validator.errors;
        }
      });
    };
  };

  // Factory for AJV validators
  return function (version) {
    return new Validator(version);
  };

});