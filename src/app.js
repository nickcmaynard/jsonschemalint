var angular = require('angular');

angular.module('app', [require('angular-route'), 'angulartics', 'angulartics.google.analytics')]).config(function ($routeProvider) {

  $routeProvider.when('/version/:specVersion/markup/:markupLanguage', {
    controller: "ValidatorController"
  });
  $routeProvider.otherwise({
    redirectTo: '/version/draft-05/markup/json'
  });

});

require('./services');
require('./controllers');