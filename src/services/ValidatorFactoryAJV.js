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
            var schemas = require('./MetaSchemaLoader');
            $log.debug('ValidatorFactoryAJV.setup()', 'Loaded AJV');
            
            validator = ajv({
              verbose: true,
              allErrors: true,
              meta: false, // Don't load a meta-schema by default
              //
              // Loading logic follows guidance at
              // https://github.com/epoberezkin/ajv/releases/tag/5.0.0
              // and 
              // https://github.com/epoberezkin/ajv/releases/tag/v6.0.0
              //
              unknownFormats: 'draft-04' === version ? 'ignore' : undefined,
              extendRefs: 'draft-04' === version ? true : undefined,
              schemaId: 'draft-04' === version ? 'id': undefined
            });
            
            if (version === 'draft-04') {
              validator.addMetaSchema(schemas.draft4);
              validator._opts.defaultMeta = schemas.draft4.id;
              validator._refs['http://json-schema.org/schema'] = 'http://json-schema.org/draft-04/schema';
              validator.removeKeyword('propertyNames');
              validator.removeKeyword('contains');
              validator.removeKeyword('const');
            }
            else if (version === 'draft-06') {
              validator.addMetaSchema(schemas.draft6);
              validator._opts.defaultMeta = schemas.draft6.$id;
            }
            else if (version === 'draft-07') {
              validator.addMetaSchema(schemas.draft7);
              validator._opts.defaultMeta = schemas.draft7.$id;
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
