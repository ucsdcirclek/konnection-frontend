'use strict';

app.factory('Auth', function(Restangular) {

  return {
    login: function(credentials, success, error) {
      var credentials = {username: $scope.username, password: $scope.password};

      Restangular.all('auth').post(credentials).then(function(result) {
        success();
        return result;
      }, function() {
        error();
      });
    },
    logout: function(success, error) {
      Restangular.all('auth').remove().then(
        function() {
          success();
        },
        function() {
          error();
        }
      );
    }
  };
});
