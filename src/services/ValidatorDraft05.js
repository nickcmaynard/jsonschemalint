'use strict';

var app = angular.module('app', false);

app.service('validatorDraft05', function ($window, $q) {

  // Initially unset for lazy-loading
  var validator;

  this.validateSchema = function (schemaObject) {
    return this._setup().then(angular.bind(this, $q, function (resolve, reject) {
      if (validator.validateSchema(schemaObject)) {
        resolve(true);
      } else {
        console.error(validator.errorsText(validator.errors));
        reject(validator.errors);
      }
    }));
  };

  this.validate = function (schemaObject, documentObject) {
    return this._setup().then(angular.bind(this, $q, function (resolve, reject) {
      if (validator.validate(schemaObject, documentObject)) {
        resolve(true);
      } else {
        console.error(validator.errorsText(validator.errors));
        reject(validator.errors);
      }
    }));
  };

  this._setup = function () {
    return $q(angular.bind(this, function (resolve, reject) {
      if (validator) {
        // Already set up
        resolve(true);
      } else {
        // Go ahead and set up the validator
        require.ensure(['ajv'], function (require) {
          // Use AJV with v5 options
          var ajv = require('ajv');
          validator = ajv({
            verbose: true,
            allErrors: true,
            v5: true
          });
          resolve(true);
        });
      }
    }));
  };

});