'use strict';

app.controller('EventItemCtrl',
  ['$scope', '$stateParams', 'Events', '$state', 'Page', 'Restangular',
   function($scope, $stateParams, Events, $state, Page, Restangular) {

     $scope.event = Events.get($stateParams.id).then(function(data) {
       $scope.event = data;
       Page.setTitle(data.title);
       $scope.event.registrations = data.getList('registrations').then(function(registrations) {
         $scope.event.registrations = registrations;

         _.forEach(registrations, function(registration) {

           if ($scope.currentUser && registration.user_id == $scope.currentUser.id) {
             $scope.registered = true;
             $scope.$apply();
           }
         });

         return registrations;
       });

       $scope.event.contact = data.customGET('contact').$object;


     });

     $scope.register = function() {
       if (!$scope.currentUser) {
         $scope.setLastState('event', $scope.event.id);
         $state.go('login.register');
         return;
       }

       $scope.event.post("register").then(function(data) {
         $scope.registered = true;
         $scope.event.registrations.push({name: $scope.currentUser.first_name + ' ' + $scope.currentUser.last_name});
         $scope.$apply;
       });
     };

     $scope.unregister = function() {
       $scope.event.post("unregister").then(function() {
         $scope.registered = false;
         $scope.event.registrations = Events.get($stateParams.id).then(function(data) {
           $scope.event.registrations = data.getList('registrations').then(function(registrations) {
             $scope.event.registrations = registrations;
           });
         });
       });
     };

     $scope.chair = function() {
       if (!isAuthorized(userRoles.officer)) {
         return;
       }

       $scope.event.registrations = Restangular.all('admin').one('events',
         $stateParams.id).getList('registrations').then(function(registrations) {
           $scope.event.registrations = registrations;
         });
     };

   }]);

app.controller('EventListCtrl',
  ['$scope', '$stateParams', 'Events', 'Restangular', '$state', 'Page',
   function($scope, $stateParams, Events, Restangular, $state, Page) {
     Page.setTitle('Events');

     $scope.uiConfig = {
       calendar: {
         columnFormat: {
           month: 'dddd',    // Monday, Wednesday, etc
           week: 'dddd, MMM dS', // Monday 9/7
           day: 'dddd, MMM dS'  // Monday 9/7
         },
         buttonText: {
           today: 'Today',
           month: 'Month',
           week: 'Week',
           day: 'Day'
         },
         ignoreTimezone: false,
         eventClick: function(event) {
           $state.go('event', {id: event.id});
         }
       }
     };

     $scope.getEvents = function(startTime, endTime, callback) {
       Restangular.all('events').getList({
         start: startTime.toISOString().replace(/\.[0-9]*/g, ''),
         end: endTime.toISOString().replace(/\.[0-9]*/g, '')
       }).then(function(eventsSrc) {
         var events = [];

         if (typeof eventsSrc !== 'undefined' && eventsSrc.length > 0) {
           _.forEach(eventsSrc, function(event) {
             events.push({
               id: event.id,
               title: event.title,
               start: event.start_time,
               end: event.end_time
             });
           });
         }

         callback(events);
       });
     };

     $scope.eventSources = [$scope.getEvents];


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