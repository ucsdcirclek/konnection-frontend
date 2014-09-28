'use strict';

app.controller('EventItemCtrl',
  ['$scope', '$stateParams', 'Events', function($scope, $stateParams, Events) {

    $scope.event = Events.get($stateParams.id).then(function(data) {
      $scope.event = data;
      $scope.event.registrations = data.getList('registrations').$object;
    });

    $scope.register = function() {
      $scope.event.post("register").then(function(data) {
        $scope.registered = true;
        $scope.$apply;
      });
    };

  }]);

app.controller('EventListCtrl',
  ['$scope', '$stateParams', 'Events', function($scope, $stateParams, Events) {
    Events.getList().then(function(events) {
      $scope.events = events;
    }, function() {
      console.log("Error loading events.");
    });
  }]);

app.controller('EventCreateCtrl',
  ['$scope', '$state', 'Restangular', function($scope, $state, Restangular) {

    $scope.startDate = new Date();
    $scope.endDate = new Date();
    $scope.closeDate = new Date();

    var create = function() {
      var values = {
        title: $scope.title,
        description: $scope.description,
        event_location: $scope.eventLocation,
        meeting_location: $scope.meetingLocation,
        start_time: $scope.startDate.toISOString().replace(/\.[0-9]*/g, ''),
        end_time: $scope.endDate.toISOString().replace(/\.[0-9]*/g, ''),
        close_time: $scope.closeDate.toISOString().replace(/\.[0-9]*/g, '')
      };

      Restangular.all('admin').all('events').post(values).then(
        function(result) {
          $state.go('admin.home');
        },
        function() {
          console.log('There was an error!');
        }
      );
    }

    $scope.create = create;
  }]);