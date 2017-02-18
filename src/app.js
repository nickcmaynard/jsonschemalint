var angular = require('angular');
var validationViewTemplateUrl = require("ngtemplate!html!./views/Validation.html");

angular.module('app', [require('angular-sanitize'), require('angular-route'), require('angular-ui-bootstrap')]).config(function($routeProvider) {

  $routeProvider.when('/version/draft-05/markup/:markupLanguage', {
    redirectTo: function(params) {
      return '/version/v5-unofficial/markup/' + params.markupLanguage;
    }
  });
  $routeProvider.when('/version/:specVersion/markup/:markupLanguage', {
    templateUrl: validationViewTemplateUrl
  });
  $routeProvider.otherwise({
    redirectTo: '/version/draft-04/markup/json'
  });

}).run(function($rootScope, $location, $window) {
  $rootScope.$on('$routeChangeSuccess', function() {
    console.info("Hash change, informing GA");
    $window.ga('send', 'pageview', $location.path());
  });
});

require('./services');
require('./controllers');
require('./components');