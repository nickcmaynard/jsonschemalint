'use strict';

var app = angular.module('app', false);

// Handles draft-04, draft-05
app.factory('validatorFactoryAJV', function ($window, $q, alertService) {

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
        console.error("Could not load AJV", error);
        alertService.alert({
          title: "Could not load module",
          message: "We couldn't load a vital part of the application.  This is probably due to network conditions.  We recommend reloading the page once conditions improve."
        });
        throw error;
      }));
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

  // Factory for AJV validators
  return function (version) {
    return new Validator(version);
  };

});