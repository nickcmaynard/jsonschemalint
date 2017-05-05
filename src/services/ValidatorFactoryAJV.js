'use strict';

var app = angular.module('app', false);

// Handles draft-04 and up
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
            var ajvKeywords = require('ajv-keywords');
            var schemas = require('./MetaSchemaLoader');
            $log.debug('ValidatorFactoryAJV.setup()', 'Loaded AJV');
            validator = ajv({
              verbose: true,
              allErrors: true,
              //
              // VERSION DETERMINATION LOGIC
              // draft-04: Official draft-04 metaschema
              // v5-unofficial: An unofficial version of the scrapped draft-05 metaschema. It's a long story, don't ask. 
              // draft-06: The official draft-06 
              // experimental: Currently draft-06, but with the $data flag enabled, and custom keywords added.
              //
              meta: !['draft-04', 'v5-unofficial'].includes(version),
              $data: ['v5-unofficial', 'experimental'].includes(version),
              patternGroups: version === 'v5-unofficial', //Waiting for patternGroups hotfix
              unknownFormats: 'ignore',
              extendRefs: true
            });
            if (version === 'draft-04') {
              validator.addMetaSchema(schemas.draft4);
              validator._opts.defaultMeta = schemas.draft4.id;
              validator.removeKeyword('propertyNames');
              validator.removeKeyword('contains');
              validator.removeKeyword('const');
            }
            else if (version === 'v5-unofficial') {
              validator.addMetaSchema(schemas.draft4);
              validator.addMetaSchema(schemas.v5);
              validator._opts.defaultMeta = schemas.v5.id;
              validator.addKeyword('constant', {macro: x => ({'const': x})});
              validator.removeKeyword('propertyNames');
              ajvKeywords(validator, ['switch', 'patternRequired', 'formatMinimum', 'formatMaximum']);
            }
            else if (version === 'experimental') {
              ajvKeywords(validator);
            }
            resolve(true);
          });
        } catch (error) {
          $log.error('ValidatorFactoryAJV.setup()', 'Could not load AJV', error);
          alertService.alert({
            title: '{{ "ERROR_MODULE_LOADING_FAILED_TITLE" | translate }}',
            message: '{{ "ERROR_MODULE_LOADING_FAILED_CONTENT" | translate }}'
          });
          reject(error);
        }
      }));
    };

    this.validateSchema = function (schemaObject) {
      $log.debug('ValidatorFactoryAJV.validateSchema()');
      return setup().then(function () {
        if (validator.validateSchema(schemaObject)) {
          $log.debug('ValidatorFactoryAJV.validateSchema()', validator.errorsText(validator.errors));
          return true;
        } else {
          $log.debug('ValidatorFactoryAJV.validateSchema()', validator.errorsText(validator.errors));
          throw validator.errors;
        }
      });
    };

    this.validate = function (schemaObject, documentObject) {
      $log.debug('ValidatorFactoryAJV.validate()');
      return setup().then(function () {
        var result;
        try {
          result = validator.validate(schemaObject, documentObject);
        } catch (e) {
          // Some errors are thrown by Ajv, not wrapped up in its nice validator.errors interface
          $log.error('ValidatorFactoryAJV.validate()', e.message);
          // Wrap the exception into our standard format
          throw [{ message: e.message }];
        }
        // Validation completed - check the results
        if(result) {
          $log.debug('ValidatorFactoryAJV.validate()', 'success');
          return true;
        } else {
          $log.error('ValidatorFactoryAJV.validate()', validator.errorsText(validator.errors));
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
