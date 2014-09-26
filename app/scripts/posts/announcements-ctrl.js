'use strict';

app.controller('PostListCtrl',
  ['$scope', '$stateParams', 'Posts', function($scope, $stateParams, Posts) {
    Posts.getList().then(function(posts) {
      $scope.posts = posts;
    }, function() {
      console.log("Error loading posts.");
    });
  }]);