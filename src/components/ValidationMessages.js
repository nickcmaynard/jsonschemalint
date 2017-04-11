var templateUrl = require('ngtemplate-loader?relativeTo=/src/!html-loader!./validation-messages.html')

//TODO: split this into two separate validation messages and validation errors component

function ValidationMessagesController() {
  // Only the "error" messages
  this.errorMessages = function(messages) {
    return messages && messages.filter(a => typeof a.dataPath !== 'undefined');
  };

  // Only "simple" messages
  this.simpleMessages = function(messages) {
    return messages && messages.filter(a => typeof a.dataPath === 'undefined');
  }
}

angular.module('app').component('validationMessages', {
  templateUrl: templateUrl,
  controller: ValidationMessagesController,
  bindings: {
    messages: '='
  }
});
