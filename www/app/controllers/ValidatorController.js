'use strict';

var app = angular.module('app', false);

app.controller('validatorController', function ($scope, $http, $window, $q, $route, $location, markupJson, markupYaml, validatorDraft01, validatorDraft02, validatorDraft03, validatorDraft04, validatorDraft05) {

  var self = this;

  this.validators = {
    "draft-01": {
      service: validatorDraft01,
      name: "draft-01"
    },
    "draft-02": {
      service: validatorDraft02,
      name: "draft-02"
    },
    "draft-03": {
      service: validatorDraft03,
      name: "draft-03"
    },
    "draft-04": {
      service: validatorDraft04,
      name: "draft-04"
    },
    "draft-05": {
      service: validatorDraft05,
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
    self.document = "";
    self.schema = "";
    ls.removeItem("data");
    ls.removeItem("schema");
  };

  this.sample = function (ref) {
    console.debug('sample', ref);

    $http.get('samples/' + ref + '.document.json').success(angular.bind(this, function (data) {
      self.document = this.markupLanguages[this.markupLanguage].service.prettyPrint(data);
    }));
    $http.get('samples/' + ref + '.schema.json').success(angular.bind(this, function (data) {
      self.schema = this.markupLanguages[this.markupLanguage].service.prettyPrint(data);
    }));

  };

  this.parseMarkup = function (thing) {
    if (!this.markupLanguages[this.markupLanguage]) {
      return $q.reject([{
        message: "Invalid markup language reference " + this.markupLanguage
      }]);
    }
    return this.markupLanguages[this.markupLanguage].service.parse(thing);
  };

  this.formatDocument = function () {
    console.debug('formatDocument');

    this.parseMarkup(this.document).then(this.markupLanguages[this.markupLanguage].service.prettyPrint).then(angular.bind(this, function(text) {
      this.document = text;
    }));

  };

  this.formatSchema = function () {
    console.debug('formatSchema');

    this.parseMarkup(this.schema).then(this.markupLanguages[this.markupLanguage].service.prettyPrint).then(angular.bind(this, function(text) {
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

  this.validateDocument = function () {

    console.debug("document change");
    this.documentErrors = [];
    this.documentMessage = "";

    if (!this.validators[this.specVersion]) {
      // Abort
      return this.documentErrors = [{
        message: "Invalid JSON schema spec version \"" + this.specVersion + "\""
      }];
    }

    this.parseMarkup(this.document).then(angular.bind(this, function (obj) {
      this.documentObject = obj;
    })).then(angular.bind(this, function () {
      if (!this.schemaObject || !this.documentObject) {
        // Bomb
        return;
      }

      // Do validation
      var validator = this.validators[this.specVersion].service;
      return validator.validateSchema(this.schemaObject).then(angular.bind(this, function (success) {
        return validator.validate(this.schemaObject, this.documentObject).then(angular.bind(this, function (success) {
          console.info("Document conforms to schema.");
          this.documentMessage = "Document conforms to the schema.";
        }), angular.bind(this, function (errors) {
          console.error("Document does not conform to schema.", errors);
          throw errors;
        }));
      }), angular.bind(this, function (errors) {
        throw [{
          message: "Can't check document against an invalid schema."
        }];
      }));

    })).catch(angular.bind(this, function (err) {
      console.error("Document errors", err);
      this.documentErrors = err;
    }));

  };

  this.validateSchema = function () {
    console.debug("schema change");
    this.schemaErrors = [];
    this.schemaMessage = "";

    if (!this.validators[this.specVersion]) {
      // Abort
      return this.schemaErrors = [{
        message: "Invalid JSON schema spec version \"" + this.specVersion + "\""
      }];
    }

    this.parseMarkup(this.schema).then(angular.bind(this, function (obj) {
      this.schemaObject = obj;
    })).then(angular.bind(this, function () {

      if (!this.schemaObject) {
        // Bomb
        return;
      }

      // Do validation
      var validator = this.validators[this.specVersion].service;
      return validator.validateSchema(this.schemaObject).then(angular.bind(this, function (success) {
        console.info("Schema is valid.");
        this.schemaMessage = "Schema is a valid schema.";
      }), angular.bind(this, function (errors) {
        console.error("Schema is invalid.", errors);
        throw errors;
      }));
    })).catch(angular.bind(this, function (err) {
      console.error("Schema errors", err);
      this.schemaErrors = err;
    }));

  };

  // Document changes
  $scope.$watch(function () {
    return self.document;
  }, function (newValue, oldValue) {
    self.validateDocument();
  });

  // Schema changes
  $scope.$watch(function () {
    return self.schema;
  }, function (newValue, oldValue) {
    self.validateSchema();
    self.validateDocument();
  });

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

    console.info("Selected markup language :: " + $route.current.params.markupLanguage);
    this.markupLanguage = $route.current.params.markupLanguage;

    // Re-check
    this.validateSchema();
    this.validateDocument();
  }));

});