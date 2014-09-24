app.controller('PostCreateCtrl',
  ['$scope', '$state', 'Restangular', function($scope, $state, Restangular) {

    var create = function() {
      var values = {
        title: $scope.title,
        body: $scope.body,
      };

      Restangular.all('admin').all('posts').post(values).then(
        function(result) {
          $state.go('admin.home');
        },
        function() {
          console.log('There was an error!');
        }
      );
    }

    $scope.create = create;
  }]);