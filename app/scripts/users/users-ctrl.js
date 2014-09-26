'use strict';

app.controller('UserUpdateCtrl',
  ['$scope', '$stateParams', '$state', 'Restangular', function($scope, $stateParams, $state, Restangular) {

    $scope.user = Restangular.one('self').get().then(function (data) {
      $scope.user = data;
    });

    $scope.update = function() {
      var input = {
        email: $scope.user.email,
        password: $scope.user.password,
        password_confirmation: $scope.user.password_confirmation,
        first_name: $scope.user.first_name,
        last_name: $scope.user.last_name
      };

      Restangular.one('self').patch(input).then(function(data) {
        console.log('Update successful.');
        $state.go('home.posts');
      });
    };

  }]);