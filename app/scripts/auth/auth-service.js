'use strict';

app.factory('Auth', ['Restangular', '$window', 'Session', '$rootScope', '$q', function(Restangular, $window, Session, $rootScope, $q) {

  var authService = {};

  authService.register = function(user, success, error) {
    Restangular.all('register').post(user).then(function(result) {
      success(result);
    }, function() {
      error();
    });
  };

  authService.login = function(credentials, remember) {
    return Restangular.all('auth').post(credentials).then(function(result) {
      // Reset Web Storage
      localStorage.clear();
      sessionStorage.clear();

      // Handle remember me
      if (remember) {
        $window.localStorage.token = result.token;
      }

      var roles = [];

      result.user.roles.forEach(
        function(element, index, array) {
          roles.push(element.id);
        }
      );

      Session.create(result.token, result.user.id, roles);

      // Set headers
      Restangular.setDefaultHeaders({'X-Auth-Token': result.token});

      $rootScope.setCurrentUser(result.user);

      return result.user;

    }, function(result) {

      console.log("Login failed.");

      // explicitly rejects promise for next chained promise to fail
      return $q.reject(result.data.error.message);
    });
  };

  authService.logout = function(success, error) {
    Restangular.all('auth').remove().then(
      function() {
        // Clear on backend
        Restangular.all('auth').remove().then(function() {
          $window.localStorage.clear();
          $window.sessionStorage.clear();
          console.log('Logged out.');
        });
      },
      function() {
        console.log("Login failed");
      }
    );
  };

  authService.isAuthenticated = function() {
    return !!Session.userId;
  };

  authService.isAuthorized = function(authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (authService.isAuthenticated() &&
    Session.userRole.length === _.intersection(authorizedRoles, Session.userRole).length);
  };


  return authService;

}]);