'use strict';

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
    };

    $scope.create = create;
  }]);

// Handles annoucements displayed on homepage.

app.controller('PostShowCtrl', ['$scope', 'Restangular', function($scope, Restangular) {

  var basePosts = Restangular.all('posts');

  basePosts.getList().then(function(posts) {
    $scope.allPosts = posts;
  });
}]);
