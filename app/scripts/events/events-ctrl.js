'use strict';

app.controller('EventItemCtrl',
  ['$scope', '$stateParams', 'Events', function($scope, $stateParams, Events) {

    $scope.event = Events.get($stateParams.id).then(function(data) {
      $scope.event = data;
      $scope.event.registrations = data.getList('registrations').$object;
    });

  }]);

app.controller('EventListCtrl',
  ['$scope', '$stateParams', 'Events', function($scope, $stateParams, Events) {
    Events.getList().then(function(events) {
      $scope.events = events;
    }, function() {
      console.log("Error loading events.");
    });
  }]);