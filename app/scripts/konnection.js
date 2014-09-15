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
    })
    .state('events', {
      url: '/events',
      templateUrl: 'partials/events/event.html',
      controller: 'EventController'
    });

  $urlRouterProvider.otherwise('/');
});

app.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  officer: 'officer',
  member: 'member'
});

app.run(function(Restangular) {
  Restangular.setBaseUrl('http://api.ucsdcki.org');

  Restangular.setRequestInterceptor(function(elem, operation) {
    if (operation === "remove") {
      return null;
    }
    return elem;
  });

  Restangular.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
    var extractedData;
    // .. to look for getList operations
    if (operation === "getList") {
      // .. and handle the data and meta data
      extractedData = data.data;
      extractedData.meta = {
        total: data.total,
        per_page: data.per_page,
        current_page: data.current_page,
        last_page: data.last_page,
        from: data.form,
        to: data.to
      };
    }
    else if (what !== 'auth') {
      extractedData = data[what];
    }

    return extractedData;
  });

  if (sessionStorage.token || localStorage.token) {
    Restangular.setDefaultHeaders({'X-Auth-Token': localStorage.token});
  }

});
