'use strict';

var app = angular.module('konnection',
	['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'restangular', 'ui.router', 'ngQuickDate', 'froala'])
.value('froalaConfig', {
	inlineMode: false
});

app.constant('USER_ROLES', {
	all: 0,
	admin: 1,
	officer: 2,
	member: 3
});

app.constant('AUTH_EVENTS', {
	loginSuccess: 'auth-login-success',
	loginFailed: 'auth-login-failed',
	logoutSuccess: 'auth-logout-success',
	sessionTimeout: 'auth-session-timeout',
	notAuthenticated: 'auth-not-authenticated',
	notAuthorized: 'auth-not-authorized'
});

app.config(['$stateProvider', '$urlRouterProvider', 'USER_ROLES',
	function($stateProvider, $urlRouterProvider, USER_ROLES) {
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
		.state('home.forms', {
			url: 'forms',
			templateUrl: 'partials/main.forms.html'
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
			templateUrl: 'partials/unavailable.html',
			controller: 'EventListCtrl'
		})
		.state('settings', {
			url: '/settings',
			templateUrl: 'partials/settings/settings.html',
			controller: 'UserUpdateCtrl',
			data: {
				authorizedRoles: [USER_ROLES.admin, USER_ROLES.officer, USER_ROLES.member]
			}
		})
		.state('admin', {
			abstract: true,
			url: '/admin',
			templateUrl: 'partials/admin/panel.html',
			data: {
				authorizedRoles: [USER_ROLES.admin, USER_ROLES.officer]
			}
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
			templateUrl: 'partials/profile/profile.html',
			controller: 'MainCtrl'
		})
		.state('circlek', {
			url: '/about',
			templateUrl: 'partials/about/circlek/circlek.html',
			abstract: true			
		})
		.state('circlek.general', {
			url: '',
			templateUrl: 'partials/about/circlek/circlek.general.html'
		})
		.state('circlek.history', {
			url: '/history',
			templateUrl: 'partials/about/circlek/circlek.history.html'
		})
		.state('circlek.structure', {
			url: '/structure',
			templateUrl: 'partials/about/circlek/circlek.structure.html'
		})
		.state('club', {
			abstract: true,
			url: '/club',
			templateUrl: 'partials/about/club/club.html'
		})
		.state('club.information', {
			url: '',
			templateUrl: 'partials/about/club/club.information.html'
		})
		.state('club.causes', {
			url: '/causes',
			templateUrl: 'partials/about/club/club.causes.html'
		})
		.state('district', {
			url: '/district',
			templateUrl:'partials/about/district/district.html'
		})
		.state('division', {
			url: '/division',
			templateUrl: 'partials/about/division/division.html'
		})
		.state('members', {
			url: '/members',
			templateUrl: 'partials/unavailable.html'
		})
		.state('contact', {
			url: '/contact',
			templateUrl: 'partials/contact/contact.html'
		});


		$urlRouterProvider.otherwise('/');
	}]);

app.run(function(Restangular) {
	Restangular.setBaseUrl('http://dev.ucsdcki.org/api');

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

app.run(['$rootScope', 'AUTH_EVENTS', 'Auth', 'USER_ROLES', function($rootScope, AUTH_EVENTS, Auth, USER_ROLES) {
	$rootScope.$on('$stateChangeStart', function(event, next) {

		try {
			var authorizedRoles = next.data.authorizedRoles;
			if (!Auth.isAuthorized(authorizedRoles)) {
				event.preventDefault();
				if (Auth.isAuthenticated()) {
          // user is not allowed
          $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      }
      else {
          // user is not logged in
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      }
  }
} catch (e) {

}
});
}]);
