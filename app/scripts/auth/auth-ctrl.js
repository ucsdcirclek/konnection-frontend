'use strict';

app
  .controller('AuthCtrl',
    ['$window', '$scope', 'Restangular', 'Auth', '$state', function($window, $scope, Restangular, Auth, $state) {
      $scope.register = function() {
        if ($window.localStorage.token || $window.sessionStorage.token) {
          console.log('Already logged in!');
          return;
        }

        var input = {
          username: $scope.username,
          email: $scope.email,
          password: $scope.password,
          password_confirmation: $scope.password_confirm,
          first_name: $scope.firstName,
          last_name: $scope.lastName
        };

        var user = Auth.register(
          input,
          function() {
            console.log('Registration successful');
          },
          function() {
            console.log('Unable to register');
          }
        );
      };

      $scope.login = function() {
        if ($window.localStorage.token || $window.sessionStorage.token) {
          console.log('Already logged in!');
          return;
        }

        var credentials = {username: $scope.auth.username, password: $scope.auth.password};

        Auth.login(credentials, $scope.remember).then(
          function(user) {
            $scope.setCurrentUser(user);
            $state.go('home');
          }
        );
      };

      $scope.logout = function() {
        Auth.logout(
          function() {

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
