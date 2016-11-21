var templateUrl = require("ngtemplate!html!./validation-messages.html")

function ValidationMessagesController() {
  // Only the "error" messages
  this.errorMessages = function(messages) {
    return messages && messages.filter(function(a) {
      return a.dataPath;
    });
  };

  // Only "simple" messages
  this.simpleMessages = function(messages) {
    return messages && messages.filter(function(a) {
      return !a.dataPath;
    });
  }
}

angular.module('app').component('validationMessages', {
  templateUrl: templateUrl,
  controller: ValidationMessagesController,
  bindings: {
    messages: '='
  }
});