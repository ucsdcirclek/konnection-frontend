'use strict';

var app = angular.module('authentication', ['restangular']);

/*app.run(['Restangular', '$window', function(Restangular, $window) {
	Restangular.addFullRequestInterceptor(function(headers, params, element, httpConfig){
		delete element.name;
		return {
			headers: window._.extend(headers, {'X-Auth-Token': $window.sessionStorage.token})
		};
	});
}]);*/

app.controller('AuthenticationController', ['$window', '$scope', 'Restangular', function($window, $scope, Restangular) {
	$scope.master = {};

	Restangular.setBaseUrl('http://api.ucsdcki.org');

	$scope.go = function() {
		Restangular.all('users').get().then(function(userinfo) {
			console.log(userinfo);
		}, function() {
			console.log('Error');
		});
	};

	$scope.save = function(user) {
		Restangular.all('register').post(user).then(function() {
			console.log('Successful');
		}, function() {
			console.log('Error');
		});
	};

	$scope.login = function(auth) {
		Restangular.all('auth').post(auth).then(function(result) {
			console.log(result.token);
			$window.sessionStorage.token = result.token;
			Restangular.setDefaultHeaders({'X-Auth-Token': $window.sessionStorage.token});
		}, function() {
			console.log('Error');
		});
	};

	$scope.reset = function() {
		$scope.user = angular.copy($scope.master);
	};

	$scope.reset();
}]);

