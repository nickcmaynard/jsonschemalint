'use strict';

var app = angular.module('app', false);

app.service('textService', function($q, $window) {

  var self = this;

  this._schemaString;
  this._documentString;

  // Accessors
  this.getSchema = function(str) {
    return self._schemaString;
  };
  this.setSchema = function(str) {
    self._schemaString = str;
  };
  this.getDocument = function(str) {
    return self._documentString;
  };
  this.setDocument = function(str) {
    self._documentString = str;
  };

  this.reset = function() {
    delete self._schemaString;
    delete self._documentString;
    ls.removeItem("data");
    ls.removeItem("schema");
  };

  // Load document & schema from localstorage
  var ls = $window['localStorage'];
  if (ls.getItem('data')) {
    console.info("Loading document from local storage");
    self._documentString = ls.getItem('data');
  }
  if (ls.getItem('schema')) {
    console.info("Loading schema from local storage");
    self._schemaString = ls.getItem('schema');
  }

  // Save form data to localstorage before unload
  $window.addEventListener('beforeunload', function() {
    if (self._documentString) {
      ls.setItem('data', self._documentString);
    } else {
      ls.removeItem("data");
    }
    if (self._schemaString) {
      ls.setItem('schema', self._schemaString);
    } else {
      ls.removeItem("schema");
    }
  });

});