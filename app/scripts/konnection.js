'use strict';

var app = angular.module('konnection', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'restangular', 'ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'partials/main.html',
      controller: 'MainCtrl'
    })
    .state('login', {
      abstract: true,
      url: '/login',
      templateUrl: 'partials/login/login.html',
      controller: 'AuthCtrl'
    })
    .state('login.info', {
      url: '',
      templateUrl: 'partials/login/login.info.html'
    })
    .state('login.register', {
      url: '/register',
      templateUrl: 'partials/login/login.register.html',
      controller: 'AuthCtrl'
    });

  $urlRouterProvider.otherwise('/');
})
;

app.run(function(Restangular) {
  Restangular.setBaseUrl('http://api.ucsdcki.org');

  Restangular.setRequestInterceptor(function(elem, operation) {
    if (operation === "remove") {
      return null;
    }
    return elem;
  });

  if (sessionStorage.token || localStorage.token) {
    Restangular.setDefaultHeaders({'X-Auth-Token': localStorage.token});
  }

});
