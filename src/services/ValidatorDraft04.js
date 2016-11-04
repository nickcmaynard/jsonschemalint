'use strict';

var app = angular.module('app', false);

app.service('validatorDraft04', function ($window, $q) {

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
          allErrors: true
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

});