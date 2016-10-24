'use strict';

var app = angular.module('app', false);

app.service('validatorDraft05', function ($window, $q) {

  // Use AJV with v5 options
  var ajv = $window['ajv'];
  var validator = ajv({
    verbose: true,
    allErrors: true,
    v5: true
  });

  this.validateSchema = function (schemaObject) {
    return $q(angular.bind(this, function (resolve, reject) {
      if (validator.validateSchema(schemaObject)) {
        resolve(true);
      } else {
        console.error(validator.errorsText(validator.errors));
        reject(validator.errors);
      }
    }));
  };

  this.validate = function (schemaObject, documentObject) {
    return $q(angular.bind(this, function (resolve, reject) {
      if (validator.validate(schemaObject, documentObject)) {
        resolve(true);
      } else {
        console.error(validator.errorsText(validator.errors));
        reject(validator.errors);
      }
    }));
  };

});