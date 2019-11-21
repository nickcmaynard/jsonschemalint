var templateUrl = require('ngtemplate-loader?relativeTo=/src/!html-loader!./validator.html')

function ValidatorController($scope, $element, $attrs, $log, $q, $window) {

  var self = this;

  // Make a *copy* so we don't accidentally effect the parent's version
  this.$onInit = function() {
    this.myDoc = this.doc;
  };

  this.$onChanges = function(changesObj) {
    // If any bound properties, such as validate, parse, doc, etc. change, rerun validation
    // $log.debug(this.identifier + ".$onChanges()", changesObj, JSON.stringify(this.myDoc));

    // We need to be a bit careful - we can't trust this "changesObj" entirely, as it actually represents the projected current & previous values of the *external* model, not our internal model
    let doUpdate = false;
    if (Object.prototype.hasOwnProperty.call(changesObj, 'doc') && changesObj.doc.currentValue !== this.myDoc) {
      this.myDoc = changesObj.doc.currentValue;
      doUpdate = true;
    }
    if (Object.prototype.hasOwnProperty.call(changesObj, 'validate') || Object.prototype.hasOwnProperty.call(changesObj, 'parse')) {
      doUpdate = true;
    }

    if (doUpdate) {
      this.update(this.myDoc);
    }
  };

  let previousDoc = undefined;
  this.update = function(doc) {
    $log.debug(this.identifier + '.update()');
    if (previousDoc !== doc) {
      this.onUpdateDoc({value: doc});
    }
    previousDoc = doc;

    if (!this.validate || !this.parse) {
      // Abort
      return this.messages = [{
        message: 'Invalid setup, validator is ' + this.validate
      },{
        message: 'Invalid setup, parse is ' + this.parse
      }];
    }

    // KEEPME: Keep track of whether we're "working".  This is used by the e2e tests
    $log.debug(self.identifier + '.update()', 'Begining work');
    this.working = true;

    // Parse
    var parsePromise = this.parse(doc);
    parsePromise.then(function(obj) {
      $log.debug(self.identifier + '.update()', 'Successful parsing', obj);
    }, function(errors) {
      $log.debug(self.identifier + '.update()', 'Errors parsing', errors);
    });

    // Validate, taking input from parse
    var validatePromise = parsePromise.then(angular.bind(this, this.validate));
    validatePromise.then(function(obj) {
      $log.debug(self.identifier + '.update()', 'Successful validating', obj);
    }, function(errors) {
      $log.debug(self.identifier + '.update()', 'Errors validating', errors);
    });

    // Combine the two, fail-fast (so if parse fails, we fail immediately rather than waiting for validate)
    var comboPromise = $q.all([parsePromise, validatePromise]).then(function(results) {
      // Successful validation
      $log.debug(self.identifier + '.update()', 'Successful parsing and validation', results);

      var obj = results[0];

      self.onUpdateObj({value: obj});
      self.isValid = true;
      return self.messages = [{
        message: self.successMessage
      }];
    }, function(errors) {
      // Something went wrong failures
      $log.debug(self.identifier + '.update()', 'Errors parsing/validating document', errors);

      self.onUpdateObj({value: null});
      self.isValid = false;
      return self.messages = [].concat(errors);
    });

    comboPromise.finally(function() {
      // KEEPME: Keep track of whether we're "working".  This is used by the e2e tests
      $log.debug(self.identifier + '.update()', 'Done working');
      self.working = false;
    });
  };

  this.format = function (doc) {
    $log.debug(this.identifier + '.format()');
    var p = this.parse(doc).then(angular.bind(this, this.prettyPrint));
    // Function
    p.then(function (text) {
      self.myDoc = text;
      self.update(self.myDoc);
    });
    // Analytics
    p.then(function() {
      $window.ga('send', {
        hitType: 'event',
        eventCategory: 'Content',
        eventAction: 'Format',
        eventLabel: self.identifier
      });
    }, function(error) {
      $window.ga('send', 'exception', {
        exDescription: 'content-format-error :: ' + error.message
      });
    });
  };

}

angular.module('app').component('validator', {
  templateUrl: templateUrl,
  controller: ValidatorController,
  bindings: {
    'identifier': '@',
    'title': '@',
    'doc': '<',
    'validate': '<',
    'parse': '<',
    'prettyPrint': '<',
    'successMessage': '<',
    'onUpdateDoc': '&',
    'onUpdateObj': '&',
  }
});
