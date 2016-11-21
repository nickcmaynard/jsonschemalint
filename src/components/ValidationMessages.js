var templateUrl = require("ngtemplate!html!./validation-messages.html")

//TODO: split this into two separate validation messages and validation errors component

function ValidationMessagesController() {
  // Only the "error" messages
  this.errorMessages = function(messages) {
    return messages && messages.filter(a => a.dataPath);
  };

  // Only "simple" messages
  this.simpleMessages = function(messages) {
    return messages && messages.filter(a => !a.dataPath);
  }
}

angular.module('app').component('validationMessages', {
  templateUrl: templateUrl,
  controller: ValidationMessagesController,
  bindings: {
    messages: '='
  }
});