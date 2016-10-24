'use strict';

var app = angular.module('app', false);

app.controller('validatorController', function ($scope, $http, $window, $q, $route, $location, validatorDraft01, validatorDraft02, validatorDraft03, validatorDraft04, validatorDraft05) {

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

  var YAML = $window['YAML'];
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

    $http.get('samples/' + ref + '.document.json').success(function (data) {
      self.document = JSON.stringify(data, null, '  ');
    });
    $http.get('samples/' + ref + '.schema.json').success(function (data) {
      self.schema = JSON.stringify(data, null, '  ');
    });

  };

  this.parseMarkup = function (thing) {
    try {
      return JSON.parse(thing);
    } catch (e) {
      console.log('not json, trying yaml');
      return YAML.parse(thing);
    }
  };

  this.reformatMarkup = function (thing) {
    try {
      return JSON.stringify(JSON.parse(thing), null, '  ');
    } catch (e) {
      return YAML.stringify(YAML.parse(thing), 4, 2);
    }
  };

  this.formatDocument = function () {
    console.debug('formatDocument');

    try {
      var documentObject = this.parseMarkup(self.document);
      this.document = this.reformatMarkup(self.document);
    } catch (e) {
      // *shrug*
    }
  };

  this.formatSchema = function () {
    console.debug('formatSchema');

    try {
      var schemaObject = this.parseMarkup(self.schema);
      this.schema = this.reformatMarkup(self.schema);
    } catch (e) {
      // *shrug*
    }
  };

  this.setVersion = function (version) {
    $route.updateParams({
      version: version
    });
  };

  this.validateDocument = function () {

    console.debug("document change");
    this.documentErrors = [];
    this.documentMessage = "";

    if (!this.validators[this.schemaVersion]) {
      // Abort
      return this.documentErrors = [{
        message: "Invalid JSON schema version \"" + this.schemaVersion + "\""
      }];
    }

    // Parse as JSON
    try {
      this.documentObject = this.parseMarkup(this.document);
      console.info("Document is valid JSON");
    } catch (e) {
      // Error parsing as JSON
      console.error("Document is NOT valid JSON");
      this.documentErrors = [{
        message: "Document is invalid JSON. Try http://jsonlint.com to fix it."
      }];
      return;
    }

    if (!this.schemaObject || !this.documentObject) {
      // Bomb
      return;
    }

    // Do validation
    var validator = this.validators[this.schemaVersion].service;
    return validator.validateSchema(this.schemaObject).then(angular.bind(this, function (success) {
      return validator.validate(this.schemaObject, this.documentObject).then(angular.bind(this, function (success) {
        console.info("Document conforms to JSON schema.");
        this.documentMessage = "Document conforms to the JSON schema.";
      }), angular.bind(this, function (errors) {
        console.error("JSON object does not conform to JSON schema.");
        this.documentErrors = errors;
        throw "Does not conform.";
      }));
    }), angular.bind(this, function (errors) {
      this.documentErrors = [{
        message: "Can't check data against an invalid schema."
      }];
      throw "Invalid schema.";
    }));

    console.log("validateDocument");

  };

  this.validateSchema = function () {
    console.debug("schema change");
    this.schemaErrors = [];
    this.schemaMessage = "";

    if (!this.validators[this.schemaVersion]) {
      // Abort
      return this.schemaErrors = [{
        message: "Invalid JSON schema version \"" + this.schemaVersion + "\""
      }];
    }

    // Parse as JSON
    try {
      this.schemaObject = this.parseMarkup(this.schema);
      console.info("Schema is valid JSON");
    } catch (e) {
      // Error parsing as JSON
      console.error("Schema is NOT valid JSON");
      this.schemaErrors = [{
        message: "Schema is invalid JSON. Try http://jsonlint.com to fix it."
      }];
      return;
    }

    if (!this.schemaObject) {
      // Bomb
      return;
    }

    // Do validation
    var validator = this.validators[this.schemaVersion].service;
    validator.validateSchema(this.schemaObject).then(angular.bind(this, function (success) {
      console.info("JSON schema is valid.");
      this.schemaMessage = "Schema is a valid JSON schema.";
    }), angular.bind(this, function (errors) {
      console.error("JSON schema is invalid.", errors);
      this.schemaErrors = errors;
      throw "Invalid schema."
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
    console.info("Selected JSON Schema version :: " + $route.current.params.version);
    this.schemaVersion = $route.current.params.version;

    // Re-check
    this.validateSchema();
    this.validateDocument();
  }));

});