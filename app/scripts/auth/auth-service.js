'use strict';

app.factory('Auth', ['Restangular', '$window', 'Session', function(Restangular, $window, Session) {

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

      console.log(result);
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

      console.log('Login successful');

      return result.user;
    }, function() {
      console.log('Login failed');
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
        error();
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