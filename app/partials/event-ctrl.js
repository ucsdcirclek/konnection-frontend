'use strict';

var app = angular.module('events', ['restangular']);

app.controller("EventController", ['$scope', 'Restangular', function($scope, Restangular) {
	Restangular.setBaseUrl('http://api.ucsdcki.org');
	
	Restangular.all('events').getList().then(function() {
		console.log("Success");

	}, function() {
		console.log("Error");
	});

}]);