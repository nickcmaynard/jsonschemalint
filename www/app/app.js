angular.module('app', ['ngRoute', 'angulartics', 'angulartics.google.analytics']).config(function ($routeProvider) {

  $routeProvider.when('/version/:specVersion/markup/:markupLanguage', {
    controller: "ValidatorController"
  });
  $routeProvider.otherwise({
    redirectTo: '/version/draft-05/markup/json'
  });

});
