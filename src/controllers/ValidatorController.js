'use strict';

var app = angular.module('app', false);

app.controller('validatorController', function($scope, $rootScope, $log, $http, $window, $q, $route, $location, $uibModal, gist, markupJson, markupYaml, validatorFactoryJSV, validatorFactoryAJV, alertService) {

  var self = this;

  this.parseMarkup = null;
  this.validateSchema = null;
  this.validateDocument = null;

  // Set up spec versions
  this.validators = {
    "draft-01": {
      service: validatorFactoryJSV("draft-01"),
      name: "draft-01"
    },
    "draft-02": {
      service: validatorFactoryJSV("draft-02"),
      name: "draft-02"
    },
    "draft-03": {
      service: validatorFactoryJSV("draft-03"),
      name: "draft-03"
    },
    "draft-04": {
      service: validatorFactoryAJV("draft-04"),
      name: "draft-04"
    },
    "draft-05": {
      service: validatorFactoryAJV("draft-05"),
      name: "draft-05"
    }
  };

  // Set up markup languages
  this.markupLanguages = {
    "json": {
      service: markupJson,
      name: "JSON"
    },
    "yaml": {
      service: markupYaml,
      name: "YAML"
    }
  };

  // Load document & schema from localstorage
  var ls = $window['localStorage'];
  if (ls.getItem('data')) {
    self.document = ls.getItem('data');
  }
  if (ls.getItem('schema')) {
    self.schema = ls.getItem('schema');
  }

  // Reset everything
  this.reset = function() {
    delete self.document;
    delete self.schema;
    ls.removeItem("data");
    ls.removeItem("schema");
  };

  // Load a sample
  this.sample = function(ref) {
    $log.debug('sample', ref);

    this.getCurrentMarkupService().then(function(markupService) {
      $http.get('samples/' + ref + '.document.json').success(function(data) {
        markupService.prettyPrint(data).then(function(text) {
          self.document = text;
        });
      });
      $http.get('samples/' + ref + '.schema.json').success(function(data) {
        markupService.prettyPrint(data).then(function(text) {
          self.schema = text;
        });
      });
    }, function(errors) {
      alertService.alert({title: "Error loading sample", message: errors[0].message, btnClass: "btn-danger"});
    });
  };

  // Load a Gist by ID
  this.loadGist = function(gistId) {
    this.loadedGistId = gistId;

    gist.retrieve(gistId).then(function(gist) {
      $log.info("Retrieved gist", gistId, gist);

      self.loadedGist = gist;

      self.schema = gist.schema;
      self.document = gist.document;

      // Register a once-off listener - if schema or document change, clobber the gist param
      var canceller,
        documentListener,
        schemaListener;
      canceller = function() {
        $log.info("Content changed from loaded gist, altering state to allow for this");
        // Don't show the gist ID in the URL
        $route.updateParams({gist: null});
        // Clear the watch
        schemaListener && schemaListener();
        documentListener && documentListener();
        // Clobber the local "we're looking at a gist" variables
        delete self.loadedGist;
        delete self.loadedGistId;
      };
      schemaListener = $scope.$watch('ctrl.schema', function(newValue) {
        if (self.loadedGist && newValue !== self.loadedGist.schema) {
          canceller();
        }
      });
      documentListener = $scope.$watch('ctrl.document', function(newValue) {
        if (self.loadedGist && newValue !== self.loadedGist.document) {
          canceller();
        }
      });

    }, function(error) {
      $log.error(error);
      alertService.alert({title: "Error loading from Gist", message: error, btnClass: "btn-danger"});
    });
  };

  // Save a Gist and inform of success
  this.saveGist = function() {
    gist.save(this.schema, this.document).then(function(gistId) {
      $route.updateParams({gist: gistId});
      var url = $location.absUrl();
      alertService.alert({
        title: "Saved as Gist",
        message: "<a target='_blank' href='" + url + "'>Visit saved schema/document pair</a>"
      });
    }, function(error) {
      $log.error(error);
      alertService.alert({title: "Error saving as Gist", message: error, btnClass: "btn-danger"});
    });
  };

  // Change the selected spec version
  this.setSpecVersion = function(specVersion) {
    $route.updateParams({specVersion: specVersion});
  };

  // Change the selected markup
  this.setMarkupLanguage = function(markupLanguage) {
    $route.updateParams({markupLanguage: markupLanguage});
  };

  // Wrapper functions to be bound to the Validator inputs
  this._parseMarkup = function(text) {
    $log.debug("_parseMarkup");
    return this.getCurrentMarkupService().then(function(service) {
      return service.parse(text);
    });
  };
  this._prettyPrint = function(obj) {
    $log.debug("_prettyPrint", obj);
    return this.getCurrentMarkupService().then(function(service) {
      return service.prettyPrint(obj);
    });
  };
  this._validateSchema = function(obj) {
    $log.debug("_validateSchema", obj);
    return this.getCurrentValidationService().then(function(service) {
      return service.validateSchema(obj);
    });
  };
  this._validateDocument = function(schemaObj, obj) {
    $log.debug("_validateDocument", schemaObj, obj);
    if (!schemaObj) {
      return $q.reject([
        {
          message: "Invalid schema."
        }
      ]);
    }
    return this.getCurrentValidationService().then(function(service) {
      return service.validate(schemaObj, obj);
    });
  };

  // Get currently referred-to validation service object
  this.getCurrentValidationService = function() {
    $log.debug("getValidatigetCurrentValidationServiceonService");
    if (!this.validators[this.specVersion]) {
      // Abort
      return $q.reject([
        {
          message: "Invalid JSON schema spec version \"" + this.specVersion + "\"."
        }
      ]);
    }
    return $q.when(this.validators[this.specVersion].service);
  }

  // Get currently referred-to markup service object
  this.getCurrentMarkupService = function() {
    $log.debug("getCurrentMarkupService");
    if (!this.markupLanguages[this.markupLanguage]) {
      return $q.reject([
        {
          message: "Invalid markup language reference " + this.markupLanguage + "."
        }
      ]);
    }
    return $q.when(this.markupLanguages[this.markupLanguage].service);
  }

  // Save form data to localstorage before unload
  $window.addEventListener('beforeunload', function() {
    if (self.document) {
      ls.setItem('data', self.document);
    } else {
      ls.removeItem("data");
    }
    if (self.schema) {
      ls.setItem('schema', self.schema);
    } else {
      ls.removeItem("schema");
    }
  });

  // When the route changes, register the new versions
  this.currentParams = {};
  $scope.$on('$routeChangeSuccess', function() {
    if (self.currentParams.specVersion !== $route.current.params.specVersion) {
      $log.info("Selected JSON Schema version :: " + $route.current.params.specVersion);
      self.specVersion = $route.current.params.specVersion;
      self.validateSchema = angular.bind(self, self._validateSchema);
      self.validateDocument = angular.bind(self, self._validateDocument, null);
    }

    if (self.currentParams.markupLanguage !== $route.current.params.markupLanguage) {
      $log.info("Selected markup language :: " + $route.current.params.markupLanguage);
      self.markupLanguage = $route.current.params.markupLanguage;
      self.parseMarkup = angular.bind(self, self._parseMarkup);
      self.prettyPrint = angular.bind(self, self._prettyPrint);
    }

    if ($route.current.params.gist && self.loadedGistId != $route.current.params.gist) {
      $log.info("Loading gist :: " + $route.current.params.gist);
      self.loadGist($route.current.params.gist);
    }

    // Save current params for change detection
    self.currentParams = $route.current.params;
  });

  // Notice when Validator components tell us things have changed
  this.onUpdateSchemaObj = function(obj) {
    // Re-bind validateDocument so an update happens
    $log.debug("Schema object changed");
    this.validateDocument = angular.bind(this, this._validateDocument, obj);
  };
  this.onUpdateDocumentString = function(doc) {
    $log.debug("Document string changed");
    this.document = doc;
  };
  this.onUpdateSchemaString = function(doc) {
    $log.debug("Schema string changed");
    this.schema = doc;
  };

});