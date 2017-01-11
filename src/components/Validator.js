var templateUrl = require("ngtemplate!html!./validator.html")

function ValidatorController($scope, $element, $attrs, $log) {

  this.$onChanges = function(changesObj) {
    // If any bound properties, such as validate, parse, doc, etc. change, rerun validation
    $log.log("onChanges", changesObj);

    // We need to be a bit careful - we can't trust this "changesObj" entirely, as it actually represents the projected current & previous values of the *external* model, not our internal model
    if ((changesObj.hasOwnProperty('doc') && changesObj.doc.currentValue !== this.doc) || changesObj.hasOwnProperty('validate') || changesObj.hasOwnProperty('parse')) {
      this.update(this.doc);
    }
  };

  let previousDoc = undefined;
  this.update = function(doc) {
    console.info("update");
    if (previousDoc !== doc) {
      this.onUpdateDoc({value: doc});
    }
    previousDoc = doc;

    if (!this.validate || !this.parse) {
      // Abort
      return this.messages = [{
        message: "Invalid setup, validator is " + this.validate
      },{
        message: "Invalid setup, parse is " + this.parse
      }];
    }

    this.parse(doc).then(angular.bind(this, function(obj) {
      // Save the object
      this.onUpdateObj({value: obj});
      return obj;
    }), angular.bind(this, function(errors) {
      this.onUpdateObj(null);
      throw errors;
    })).then(angular.bind(this, this.validate)).then(angular.bind(this, function(success) {
      // Successful validation
      $log.info("Successful validation");
      this.isValid = true;
      return this.messages = [{
        message: this.successMessage
      }];
    }), angular.bind(this, function(errors) {
      // Something went wrong failures
      $log.error("Errors parsing/validating document", errors);
      this.isValid = false;
      return this.messages = errors;
    }));
  };

  this.format = function (doc) {
    console.debug('Format');
    this.parse(doc).then(this.prettyPrint).then(angular.bind(this, function (text) {
      this.doc = text;
    }));
  };

}

angular.module('app').component('validator', {
  templateUrl: templateUrl,
  controller: ValidatorController,
  bindings: {
    "title": "@",
    "doc": "<",
    "validate": "<",
    "parse": "<",
    "prettyPrint": "<",
    "successMessage": "<",
    "onUpdateDoc": "&",
    "onUpdateObj": "&",
  }
});