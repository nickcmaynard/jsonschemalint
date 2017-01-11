var templateUrl = require("ngtemplate!html!./validator.html")

function ValidatorController($scope, $element, $attrs, $log) {

  this.$onChanges = function(changesObj) {
    // If any bound properties, such as validate, parse, doc, etc. change, rerun validation
    $log.log("onChanges", changesObj);
    this.update(this.doc);
  };

  this.update = function(doc) {
    this.onUpdateDoc({value: doc});

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
      this.onUpdateValidity({value: true});
      return this.messages = [{
        message: this.successMessage
      }];
    }), angular.bind(this, function(errors) {
      // Something went wrong failures
      $log.error("Errors parsing/validating document", errors);
      this.onUpdateValidity({value: false});
      return this.messages = errors;
    }));
  }

}

angular.module('app').component('validator', {
  templateUrl: templateUrl,
  controller: ValidatorController,
  bindings: {
    "doc": "<",
    "validate": "<",
    "parse": "<",
    "successMessage": "<",
    "onUpdateDoc": "&",
    "onUpdateObj": "&",
    "onUpdateValidity": "&"
  }
});