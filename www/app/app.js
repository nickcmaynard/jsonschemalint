angular.module('app', ['ngRoute']).config(function ($routeProvider) {

  $routeProvider.when('/version/:version', {
    controller: "ValidatorController"
  });
  $routeProvider.otherwise({
    redirectTo: '/version/draft-05'
  });

});
