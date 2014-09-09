'use strict';

var app = angular.module('register', ['restangular']);

app.controller('RegisterController', ['$scope', 'Restangular', function($scope, Restangular) {
	$scope.master = {};

	Restangular.setBaseUrl('http://api.ucsdcki.org');


	$scope.save = function(user) {
		//$scope.master = angular.copy(user);
		Restangular.all('register').post(user).then(function() {
			console.log('Successful');
		}, function() {
			console.log('Error');
		});
	};



	$scope.reset = function() {
		$scope.user = angular.copy($scope.master);
	};

	$scope.reset();
}]);