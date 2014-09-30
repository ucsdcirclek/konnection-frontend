'use strict';

app.controller('PostListCtrl',
	['$scope', '$stateParams', 'Posts', function($scope, $stateParams, Posts) {
		Posts.getList().then(function(posts) {
			$scope.posts = posts;
		}, function() {
			console.log("Error loading posts.");
		});
	}]);
app.controller('PostItemCtrl', 
	['$scope', '$stateParams','Posts', function($scope, $stateParams, Posts){
		$scope.post = Posts.get($stateParams.id).then(function(data) {
			$scope.post = data;
		});
	}]);