'use strict';

app.factory("Posts", ['Restangular', function(Restangular) {
	return Restangular.all('posts');
}]);