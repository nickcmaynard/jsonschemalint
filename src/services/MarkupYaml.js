'use strict';

var app = angular.module('app', false);

app.service('markupYaml', function ($window, $q, alertService, $log) {

  var yaml;

  var _setupPromise;
  var setup = function() {
    return _setupPromise || (_setupPromise = $q(function(resolve, reject) {
      try {
        require.ensure([], function(require) {
          yaml = require('yamljs');
          $log.debug('MarkupYAML.setup()', 'Loaded yamljs');
          resolve(true);
        });
      } catch (error) {
        $log.error('MarkupYAML.setup()', 'Could not load yamljs', error);
        alertService.alert({
          title: '{{ "ERROR_MODULE_LOADING_FAILED_TITLE" | translate }}',
          message: '{{ "ERROR_MODULE_LOADING_FAILED_CONTENT" | translate }}'
        });
        reject(error);
      }
    }));
  };

  this.parse = function (text) {
    return setup().then(function () {
      try {
        var obj = yaml.parse(text);
        return obj;
      } catch (err) {
        throw [{
          message_tid: 'ERROR_INVALID_YAML'
        }];
      }
    });
  };

  this.prettyPrint = function (obj) {
    // We wrap this in $q otherwise the digest doesn't fire correctly
    return setup().then(function () {
      return yaml.stringify(obj, 4, 2);
    });
  };

});
