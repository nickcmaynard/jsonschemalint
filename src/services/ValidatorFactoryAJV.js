'use strict';

var app = angular.module('app', false);

// Handles draft-04, draft-05
app.factory('validatorFactoryAJV', function ($window, $q, alertService, $log) {

  var Validator = function (version) {
    // Initially unset for lazy-loading
    var validator;

    var _setupPromise;
    var setup = function () {
      // We wrap this in $q otherwise the digest doesn't fire correctly
      return _setupPromise || (_setupPromise = $q.when(require('async-module?promise!ajv')).then(function (ajv) {
        validator = ajv({
          verbose: true,
          allErrors: true,
          //
          // VERSION DETERMINATION LOGIC
          //
          v5: version === "draft-05"
        });
        return true;
      }).catch(function (error) {
        $log.error("ValidatorFactoryAJV.setup()", "Could not load AJV", error);
        alertService.alert({
          title: "Could not load module",
          message: "We couldn't load a vital part of the application.  This is probably due to network conditions.  We recommend reloading the page once conditions improve."
        });
        throw error;
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
        if (validator.validate(schemaObject, documentObject)) {
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