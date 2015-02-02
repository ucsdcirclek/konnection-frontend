'use strict';

app.controller('PostCreateCtrl',
  ['$scope', '$state', 'Restangular', function($scope, $state, Restangular) {
    $scope.categories = [];

    Restangular.all('post_categories').getList().then(function(results) {
      $scope.categories = results;
    });

    var create = function() {
      var values = {
        title: $scope.title,
        content: $scope.content,
        category_id: $scope.category.id
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
