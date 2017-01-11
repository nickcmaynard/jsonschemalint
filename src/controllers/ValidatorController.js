'use strict';

var app = angular.module('app', false);

app.controller('validatorController', function ($scope, $rootScope, $http, $window, $q, $route, $location, $uibModal, gist, markupJson, markupYaml, validatorFactoryJSV, validatorFactoryAJV, alertService) {

  var self = this;

  this.parseMarkup = null;
  this.validateSchema = null;
  this.validateDocument = null;

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

  var ls = $window['localStorage'];

  if (ls.getItem('data')) {
    self.document = ls.getItem('data');
  }

  if (ls.getItem('schema')) {
    self.schema = ls.getItem('schema');
  }


  this.reset = function () {
    delete self.document;
    delete self.schema;
    ls.removeItem("data");
    ls.removeItem("schema");
  };

  this.sample = function (ref) {
    console.debug('sample', ref);

    $http.get('samples/' + ref + '.document.json').success(angular.bind(this, function (data) {
      $q.when(this.markupLanguages[this.markupLanguage].service.prettyPrint(data)).then(function(text) {
        self.document = text;
      });
    }));
    $http.get('samples/' + ref + '.schema.json').success(angular.bind(this, function (data) {
      $q.when(this.markupLanguages[this.markupLanguage].service.prettyPrint(data)).then(function(text) {
        self.schema = text;
      });
    }));

  };

  this._parseMarkup = function (thing) {
    if (!this.markupLanguages[this.markupLanguage]) {
      return $q.reject([{
        message: "Invalid markup language reference " + this.markupLanguage + "."
      }]);
    }
    return this.markupLanguages[this.markupLanguage].service.parse(thing);
  };

  // Doesn't work
  this.formatDocument = function () {
    console.debug('formatDocument');

    this._parseMarkup(this.document).then(this.markupLanguages[this.markupLanguage].service.prettyPrint).then(angular.bind(this, function (text) {
      this.document = text;
    }));

  };

  this.formatSchema = function () {
    console.debug('formatSchema');

    this._parseMarkup(this.schema).then(this.markupLanguages[this.markupLanguage].service.prettyPrint).then(angular.bind(this, function (text) {
      console.debug('formatSchema', text, this);
      this.schema = text;
    }));

  };

  this.setSpecVersion = function (specVersion) {
    $route.updateParams({
      specVersion: specVersion
    });
  };

  this.setMarkupLanguage = function (markupLanguage) {
    $route.updateParams({
      markupLanguage: markupLanguage
    });
  };

  this._validateSchema = function(obj) {
    if (!this.validators[this.specVersion]) {
      // Abort
      return $q.reject([{
        message: "Invalid JSON schema spec version \"" + this.specVersion + "\"."
      }]);
    }

    var validator = this.validators[this.specVersion].service;
    return validator.validateSchema[obj];
  };

  this._validateDocument = function(schemaObj, obj) {
    if (!this.validators[this.specVersion]) {
      // Abort
      return $q.reject([{
        message: "Invalid JSON schema spec version \"" + this.specVersion + "\"."
      }]);
    }

    if (!schemaObj) {
      return $q.reject([{
        message: "Invalid schema."
      }]);
    }

    var validator = this.validators[this.specVersion].service;
    return validator.validate(schemaObj, obj);
  };

  this.loadGist = function (gistId) {
    this.loadedGistId = gistId;

    gist.retrieve(gistId).then(angular.bind(this, function (gist) {
      console.info("Retrieved gist", gistId, gist);

      this.loadedGist = gist;

      this.schema = gist.schema;
      this.document = gist.document;

      // Register a once-off listener - if schema or document change, clobber the gist param
      var canceller, documentListener, schemaListener;
      canceller = angular.bind(this, function () {
        console.info("Content changed from loaded gist, altering state to allow for this");
        // Don't show the gist ID in the URL
        $route.updateParams({
          gist: null
        });
        // Clear the watch
        schemaListener && schemaListener();
        documentListener && documentListener();
        // Clobber the local "we're looking at a gist" variables
        delete this.loadedGist;
        delete this.loadedGistId;
      });
      schemaListener = $scope.$watch(function () {
        return self.schema;
      }, angular.bind(this, function (newValue) {
        if (this.loadedGist && newValue !== this.loadedGist.schema) {
          canceller();
        }
      }));
      documentListener = $scope.$watch(function () {
        return self.document;
      }, angular.bind(this, function (newValue) {
        if (this.loadedGist && newValue !== this.loadedGist.document) {
          canceller();
        }
      }));

    }), angular.bind(this, function (error) {
      console.error(error);
      alertService.alert({
        title: "Error loading from Gist",
        message: error,
        btnClass: "btn-danger"
      });
    }));
  };

  this.saveGist = function () {
    gist.save(this.schema, this.document).then(angular.bind(this, function (gistId) {
      $route.updateParams({
        gist: gistId
      });
      var url = $location.absUrl();
      alertService.alert({
        title: "Saved as Gist",
        message: "<a target='_blank' href='" + url + "'>Visit saved schema/document pair</a>"
      });
    }), angular.bind(this, function (error) {
      console.error(error);
      alertService.alert({
        title: "Error saving as Gist",
        message: error,
        btnClass: "btn-danger"
      });
    }));
  };

  // Save form data before reload
  $window.addEventListener('beforeunload', function () {
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
  $scope.$on('$routeChangeSuccess', angular.bind(this, function () {
    console.info("Selected JSON Schema version :: " + $route.current.params.specVersion);
    this.specVersion = $route.current.params.specVersion;
    this.validateSchema = angular.bind(this, this._validateSchema);
    this.validateDocument = angular.bind(this, this._validateDocument, null);

    console.info("Selected markup language :: " + $route.current.params.markupLanguage);
    this.markupLanguage = $route.current.params.markupLanguage;
    this.parseMarkup = angular.bind(this, this._parseMarkup);

    if ($route.current.params.gist && this.loadedGistId != $route.current.params.gist) {
      console.info("Loading gist :: " + $route.current.params.gist);
      this.loadGist($route.current.params.gist);
    }
  }));

  this.onUpdateSchemaObj = function(obj) {
    // Re-bind validateDocument so an update happens
    console.debug("Schema object changed");
    this.validateDocument = angular.bind(this, this._validateDocument, obj);
  };

  this.onUpdateDocumentString = function(doc) {
    console.debug("Document string changed");
    this.document = doc;
  };

  this.onUpdateSchemaString = function(doc) {
    console.debug("Schema string changed");
    this.schema = doc;
  };

  this.onUpdateDocumentValidity = function(valid) {
    console.debug("Document validity changed", valid);
    this.documentValid = valid;
  };

  this.onUpdateSchemaValidity = function(valid) {
    console.debug("Schema validity changed", valid);
    this.schemaValid = valid;
  };



});