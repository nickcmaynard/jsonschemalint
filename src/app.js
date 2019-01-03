require('./css/main.css');
require('babel-polyfill');

var angular = require('angular');

angular.module('app', [require('angular-sanitize'), require('angular-route'), require('angular-ui-bootstrap'), require('angular-translate'), require('angular-translate-loader-static-files')]).config(function($routeProvider, $translateProvider) {

  $translateProvider.useSanitizeValueStrategy('sanitize');
  // Bake in 'en' using webpack
  $translateProvider.translations('en', require('../www/translations/locale-en.json'));
  // For everything else, go to the static files loader
  $translateProvider.useStaticFilesLoader({
    prefix: 'translations/locale-',
    suffix: '.json'
  });
  $translateProvider.preferredLanguage('en');

  $routeProvider.when('/version/draft-05/markup/:markupLanguage', {
    redirectTo: function(params) {
      return '/version/v5-unofficial/markup/' + params.markupLanguage;
    }
  });
  $routeProvider.when('/version/:specVersion/markup/:markupLanguage', {
    template: '<validator-view></validator-view>'
  });
  $routeProvider.otherwise({
    redirectTo: '/version/draft-07/markup/json'
  });

}).run(function($rootScope, $location, $window, $log) {
  $rootScope.$on('$routeChangeSuccess', function() {
    $log.info('Hash change, informing GA', $location.path());
    $window.ga('send', 'pageview', $location.path());
  });

  // Service worker registration
  var runtime = require('serviceworker-webpack-plugin/lib/runtime');
  if ('serviceWorker' in navigator) {
    runtime.register();
    $log.info('Service Worker registered');
  }
});

require('./services');
require('./components');
