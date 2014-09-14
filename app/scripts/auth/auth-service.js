'use strict';

app.factory('Auth', function(Restangular) {

  return {
    register: function(user, success, error) {
      Restangular.all('register').post(user).then(function(result) {
        success(result);
      }, function() {
        error();
      });
    },
    login: function(credentials, success, error) {
      Restangular.all('auth').post(credentials).then(function(result) {
        success(result);
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
