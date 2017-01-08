var templateUrl = require("ngtemplate!html!./validator.html")

function ValidatorController() {
}

angular.module('app').component('validator', {
  templateUrl: templateUrl,
  controller: ValidatorController,
  bindings: {
    "validator": "=",
    "parser": "="
  }
});