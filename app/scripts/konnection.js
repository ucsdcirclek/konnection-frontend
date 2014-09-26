'use strict';

var app = angular.module('konnection',
	['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'restangular', 'ui.router', 'ngQuickDate', 'froala'])
.value('froalaConfig', {
	inlineMode: false
});

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('home', {
		abstract: true,
		url: '/',
		templateUrl: 'partials/main.html',
		controller: 'MainCtrl'
	})
	.state('home.posts', {
		url: '',
		templateUrl: 'partials/main.posts.html',
		controller: 'PostListCtrl'
	})
	.state('home.events', {
		url: 'events',
		templateUrl: 'partials/events/events.html',
		controller: 'EventListCtrl'
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
	.state('event', {
		url: '/events/:id',
		templateUrl: 'partials/events/event.html',
		controller: 'EventItemCtrl'
	})
	.state('calendar', {
		url: '/calendar',
		templateUrl: 'partials/calendar/calendar.html',
		controller: 'EventListCtrl'
	})
	.state('admin', {
		abstract: true,
		url: '/admin',
		templateUrl: 'partials/admin/panel.html'
	})
	.state('admin.home', {
		url: '',
		templateUrl: 'partials/admin/home.html'
	})
	.state('admin.events', {
		abstract: true,
		url: '/events',
		template: '<div ui-view></div>'
	})
	.state('admin.events.create', {
		url: '/create',
		templateUrl: 'partials/admin/events/create.html',
		controller: 'EventCreateCtrl'
	})
	.state('admin.posts', {
		abstract: true,
		url: '/posts',
		template: '<div ui-view></div>'
	})
	.state('admin.posts.create', {
		url: '/create',
		templateUrl: 'partials/admin/posts/create.html',
		controller: 'PostCreateCtrl'
	})
	.state('profile', {
		url: '/profile',
		templateUrl: 'partials/profile/profile.html'
	})


	$urlRouterProvider.otherwise('/');
});

app.constant('USER_ROLES', {
	all: 0,
	admin: 1,
	officer: 2,
	member: 3
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
		var extractedData = data;
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
  	for (var key in data) {
  		if (data.hasOwnProperty(key)) {
  			extractedData = data[key];
  			break;
  		}
  	}
  }


  return extractedData;
});

	if (sessionStorage.token || localStorage.token) {
		Restangular.setDefaultHeaders({'X-Auth-Token': localStorage.token});
	}

});
