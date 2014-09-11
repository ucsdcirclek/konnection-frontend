'use strict';

app
  .controller('AuthController',
    ['$window', '$scope', 'Restangular', 'Auth', function($window, $scope, Restangular, Auth) {
      $scope.login = function() {
        if ($window.localStorage.token || $window.sessionStorage.token) {
          console.log('Already logged in!');
          return;
        }

        var credentials = {username: $scope.username, password: $scope.password};
        var user = Auth.login(
          credentials,
          function() {
            console.log('Login successful');
          },
          function() {
            console.log('Unable to login');
          }
        );

        // Reset Web Storage
        localStorage.clear();
        sessionStorage.clear();

        // Handle remember me
        if ($scope.remember) {
          $window.localStorage.token = user.token;
        }
        else {
          $window.sessionStorage.token = user.token;
        }

        // Set headers
        Restangular.setDefaultHeaders({'X-Auth-Token': $window.sessionStorage.token});
      };

      $scope.logout = function() {
        Auth.logout(
          function() {
            sessionStorage.clear();
            sessionStorage.clear();
            console.log('Logged out.');
          },
          function() {
            console.log('Unable to log out.');
          }
        );
      };

      $scope.reset = function() {
        $scope.username = '';
        $scope.password = '';
        $scope.remember = false;
      };

      $scope.reset();

    }]);
