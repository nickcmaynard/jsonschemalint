var templateUrl = require("ngtemplate!html!./validation-messages.html")

function ValidationMessagesController() {

}

angular.module('app').component('validationMessages', {
  templateUrl: templateUrl,
  controller: ValidationMessagesController,
  bindings: {
    messages: '='
  }
});