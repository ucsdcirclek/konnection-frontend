'use strict';

var app = angular.module('konnection', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'restangular', 'ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'partials/main.html',
      controller: 'MainCtrl'
    });

  $urlRouterProvider.otherwise('/');
})
;

app.run(function(Restangular, BaseUrlCalculator) {
  Restangular.setBaseUrl('http://api.ucsdcki.org');

  Restangular.setRequestInterceptor(function(elem, operation) {
    if (operation === "remove") {
      return null;
    }
    return elem;
  });

  if (sessionStorage.token || localStorage.token) {
    Restangular.setDefaultHeaders({'X-Auth-Token': $window.localStorage.token});
  }

});
