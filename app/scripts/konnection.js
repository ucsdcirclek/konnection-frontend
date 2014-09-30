'use strict';

var app = angular.module('konnection',
  ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'restangular', 'ui.router', 'ngQuickDate', 'froala',
   'angular-carousel', 'ui.calendar'])
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

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'USER_ROLES',
            function($stateProvider, $urlRouterProvider, $locationProvider, USER_ROLES) {
              $locationProvider.html5Mode( true );

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
                  url: 'upcoming',
                  templateUrl: 'partials/unavailable.html'
                })
                .state('home.forms', {
                  url: 'forms',
                  templateUrl: 'partials/unavailable.html'
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
                .state('login.register-success', {
                  url: '/register/success',
                  templateUrl: 'partials/login/login.register-success.html'
                })
                .state('event', {
                  url: '/events/:id',
                  templateUrl: 'partials/events/event.html',
                  controller: 'EventItemCtrl'
                })
                .state('calendar', {
                  url: '/events',
                  templateUrl: 'partials/calendar/calendar.html',
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
                  abstract: true,
                  controller: ['Page', function(Page){
                    Page.setTitle('About');
                  }]
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
                .state('circlek.tenets', {
                  url: '/tenets',
                  templateUrl: 'partials/about/circlek/circlek.tenets.html'
                })
                .state('club', {
                  abstract: true,
                  url: '/club',
                  templateUrl: 'partials/about/club/club.html'
                })
                .state('club.general', {
                  url: '',
                  templateUrl: 'partials/about/club/club.general.html'
                })
                .state('club.board', {
                  url: '/board',
                  templateUrl: 'partials/about/club/club.board.html'
                })
                .state('club.causes', {
                  url: '/causes',
                  templateUrl: 'partials/about/club/club.causes.html'
                })
                .state('club.tenets', {
                  url: '/tenets',
                  templateUrl: 'partials/about/club/club.tenets.html'
                })
                .state('district', {
                  url: '/district',
                  templateUrl: 'partials/about/district/district.html'
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
                  templateUrl: 'partials/contact/contact.html',
                  controller: ['Page', function(Page){
                    Page.setTitle('Contact Us');
                  }]
                })
                .state('articles', {
                  url: '/articles',
                  templateUrl: 'partials/articles/articles.html',
                  controller: 'PostListCtrl'
                })
                .state('article', {
                  url: '/articles/:id',
                  templateUrl: 'partials/articles/article.html',
                  controller: 'PostItemCtrl'
                });


              $urlRouterProvider.otherwise('/');
            }]);

app.run(['Restangular', 'Session', '$rootScope', function(Restangular, Session, $rootScope) {
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
      if (data.hasOwnProperty('data')) {
        extractedData = data.data;
      }

      if (what !== 'events') {
        extractedData.meta = {
          total: data.total,
          per_page: data.per_page,
          current_page: data.current_page,
          last_page: data.last_page,
          from: data.form,
          to: data.to
        };
      }
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
    var token = typeof sessionStorage.token === 'undefined' ? localStorage.token : sessionStorage.token
    Restangular.setDefaultHeaders({'X-Auth-Token': token});

    var user = Restangular.one('self').get().then(function(data) {
      var roles = [];

      data.roles.forEach(
        function(element, index, array) {
          roles.push(element.id);
        }
      );

      console.log(data);

      Session.create(token, data.id, roles);
      $rootScope.setCurrentUser(data);
    });
  }

}]);

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
    }
    catch (e) {

    }
  });
}]);

app.run(['$rootScope', '$state', '$stateParams',
         function($rootScope, $state, $stateParams) {
           $rootScope.$state = $state;
           $rootScope.$stateParams = $stateParams;
         }]);

app.filter('tel', function() {
  return function(tel) {
    if (!tel) {
      return '';
    }

    var value = tel.toString().trim().replace(/^\+/, '');

    if (value.match(/[^0-9]/)) {
      return tel;
    }

    var country, city, number;

    switch (value.length) {
      case 10: // +1PPP####### -> C (PPP) ###-####
        country = 1;
        city = value.slice(0, 3);
        number = value.slice(3);
        break;

      case 11: // +CPPP####### -> CCC (PP) ###-####
        country = value[0];
        city = value.slice(1, 4);
        number = value.slice(4);
        break;

      case 12: // +CCCPP####### -> CCC (PP) ###-####
        country = value.slice(0, 3);
        city = value.slice(3, 5);
        number = value.slice(5);
        break;

      default:
        return tel;
    }

    if (country == 1) {
      country = "";
    }

    number = number.slice(0, 3) + '-' + number.slice(3);

    return (country + " (" + city + ") " + number).trim();
  };
});

app.factory('Page', function(){
  var title = 'Home';
  return {
    title: function() { return title; },
    setTitle: function(newTitle) { title = newTitle; }
  };
});
