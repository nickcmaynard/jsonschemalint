var angular = require('angular');

angular.module('app', [require('angular-route'), require('angular-ui-bootstrap')]).config(function ($routeProvider) {

  $routeProvider.when('/version/:specVersion/markup/:markupLanguage', {
    controller: "ValidatorController"
  });
  $routeProvider.otherwise({
    redirectTo: '/version/draft-05/markup/json'
  });

}).run(function ($rootScope, $location, $window) {
  $rootScope.$on('$routeChangeSuccess', function () {
    console.info("Hash change, informing GA");
    $window.ga('send', 'pageview', $location.path());
  });
});

require('./services');
require('./controllers');
require('./components');