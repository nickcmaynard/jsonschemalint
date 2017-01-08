var templateUrl = require("ngtemplate!html!./validator.html")

function ValidatorController($scope, $element, $attrs, $log) {
  this.changeDoc = function(doc) {
    $log.log("Document is now", doc);
  }
}

angular.module('app').component('validator', {
  templateUrl: templateUrl,
  controller: ValidatorController,
  bindings: {
    "doc": "=",
    "validate": "=",
    "parse": "="
  }
});