'use strict';

var app = angular.module('app', false);

app.controller('validatorController', function ($scope, $http, $window) {

  var ajv = $window['ajv'];
  var validator = ajv({v5: true, verbose:true, allErrors:true});
  var YAML = $window['YAML'];
  var ls = $window['localStorage'];

  var self = this;
  
  if (ls.getItem('data')) {
    self.document = ls.getItem('data');
  }
  
  if (ls.getItem('schema')) {
    self.schema = ls.getItem('schema');
  }

  this.reset = function() {
    self.document = "";
    self.schema = "";
    ls.removeItem("data");
    ls.removeItem("schema");
  };

  this.sample = function(ref) {
    console.debug('sample', ref);

    $http.get('samples/' + ref + '.document.json').success(function(data) {
      self.document = JSON.stringify(data, null, '  ');
    });
    $http.get('samples/' + ref + '.schema.json').success(function(data) {
      self.schema = JSON.stringify(data, null, '  ');
    });

  };

  this.parseMarkup = function(thing) {
    try {
      return JSON.parse(thing);
    } catch (e) {
      console.log('not json, trying yaml');
      return YAML.parse(thing);
    }
  };

  this.reformatMarkup = function(thing) {
    try {
      return JSON.stringify(JSON.parse(thing), null, '  ');
    } catch (e) {
      return YAML.stringify(YAML.parse(thing), 4, 2);
    }
  };

  this.formatDocument = function() {
    console.debug('formatDocument');

    try {
      var documentObject = this.parseMarkup(self.document);
      this.document = this.reformatMarkup(self.document);
    } catch (e) {
      // *shrug*
    }
  };

  this.formatSchema = function() {
    console.debug('formatSchema');

    try {
      var schemaObject = this.parseMarkup(self.schema);
      this.schema = this.reformatMarkup(self.schema);
    } catch (e) {
      // *shrug*
    }
  };

  this.validateDocument = function () {
    console.debug("document");
    self.documentErrors = [];
    self.documentMessage = "";

    // Parse as JSON
    try {
      self.documentObject = this.parseMarkup(self.document);

      // Do validation
      if (validator.validateSchema(this.schemaObject)) {
        if (validator.validate(this.schemaObject, this.documentObject)) {
          this.documentMessage = "Document conforms to the JSON schema."; 
        } else {
          console.log(validator.errorsText(ajv.errors));
          this.documentErrors = validator.errors;
        }   
      } else {
        this.documentErrors = [{message: "Can't check data against an invalid schema."}]
      }
    } catch (e) {
      // Error parsing as JSON
      self.documentErrors = [{message: "Document is invalid JSON. Try http://jsonlint.com to fix it." }];
    }

    console.log("validateDocument");

  };

  this.validateSchema = function () {
    console.debug("schema");
    self.schemaErrors = [];
    self.schemaMessage = "";

    // Parse as JSON
    try {
      self.schemaObject = this.parseMarkup(self.schema);

      // Do validation
      if (validator.validateSchema(this.schemaObject)) {
        this.schemaMessage = "Schema is a valid JSON schema.";
      } else {
        console.log(validator.errorsText(ajv.errors));
        this.schemaErrors = validator.errors;
      }
    } catch (e) {
      // Error parsing as JSON
      self.schemaErrors = [{ message: "Schema is invalid JSON. Try http://jsonlint.com to fix it." }];
    }

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
  $window['onbeforeunload'] = function () {
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
  };
});
