'use strict';

var app = angular.module('app', false);

app.controller('validatorController', function ($scope, $http, $window) {

    var validator = $window['isMyJsonValid'];

    var self = this;

    // Load the meta-schema
    $http.get('meta-schema/schema.json').success(function (data) {
        self.metaSchema = data;
    });

    this.reset = function () {
        self.document = "";
        self.schema = "";
        self.schemaMessage = null;
        self.documentMessage = null;
        self.schemaErrors = [];
        self.documentErrors = [];
        document.getElementById('json-schema-input').value = null;
        document.getElementById('json-document-input').value = null;
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
        if (!thing) return;
        return jsonlint.parse(thing);
    };

    this.reformatMarkup = function (thing) {
        if (!thing) return;
        return JSON.stringify(JSON.parse(thing), null, '  ');
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

    this.validateDocument = function () {
        if (!self.document) return;
        console.debug("validateDocument");
        self.documentErrors = [];
        self.documentMessage = "";

        // Parse as JSON
        try {
            self.documentObject = this.parseMarkup(self.document);

            // Do validation
            var documentValidator = validator(this.schemaObject, {
                verbose: true
            });
            documentValidator(this.documentObject);
            console.log(documentValidator.errors);
            if (documentValidator.errors && documentValidator.errors.length) {
                this.documentErrors = documentValidator.errors;
            } else {
                this.documentMessageStyle = "pass";
                this.documentMessage = "Document conforms to the JSON schema.";
            }
        } catch (e) {
            console.log(e);
            // Error parsing as JSON
            this.documentMessageStyle = "fail";
            this.documentMessage = e;
        }

    };

    this.validateSchema = function () {
        if (!self.schema) return;
        console.debug("validateSchema");
        self.schemaErrors = [];
        self.schemaMessage = "";

        // Parse as JSON
        try {
            self.schemaObject = this.parseMarkup(self.schema);

            // Can't be done if we don't have the meta schema yet
            if (!this.metaSchema) {
                return;
            }

            // Do validation
            var schemaValidator = validator(this.metaSchema, {
                verbose: true
            });
            schemaValidator(this.schemaObject);
            console.log(schemaValidator.errors);
            if (schemaValidator.errors && schemaValidator.errors.length) {
                this.schemaErrors = schemaValidator.errors;
            } else {
                this.schemaMessageStyle = "pass";
                this.schemaMessage = "Schema is a valid JSON schema.";
            }
        } catch (e) {
            console.log(e);
            // Error parsing as JSON
            this.schemaMessageStyle = "fail";
            this.schemaMessage = e;
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

});
