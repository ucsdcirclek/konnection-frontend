'use strict';

app.controller("EventController", ['$scope', 'Restangular', function($scope, Restangular) {
	
	Restangular.all('events').getList().then(function(events) {
		$scope.events = events;
		console.log(events);
	}, function() {
		console.log();
	});
}]);