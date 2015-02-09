'use strict';

app.controller('EventItemCtrl',
  ['$scope', '$stateParams', 'Events', '$state', 'Restangular',
   function($scope, $stateParams, Events, $state, Restangular) {
     $scope.open = false;
     $scope.driving = false;
     $scope.photographer = false;
     $scope.writer = false;

     $scope.event = Events.get($stateParams.id).then(function(data) {
       $scope.event = data;
       $scope.event.registrations = [];
       $scope.setTitle(data.title);
       var now = new moment();
       var closeTime = new moment(data.close_time);

       if (now < closeTime) {
         $scope.open = true;
       }

       data.getList('registrations').then(function(registrations) {
         _.forEach(registrations, function(registration) {

           $scope.event.registrations.push({
             name: registration.name,
             driver_status: registration.driver_status,
             photographer_status: registration.photographer_status,
             writer_status: registration.writer_status,
             guest_status: false,
             created_at: registration.created_at,
             avatar: registration.avatar
           });

           if ($scope.currentUser && registration.user_id == $scope.currentUser.id) {
             $scope.registered = true;
             $scope.driving = registration.driver_status;
             $scope.photographer = registration.photographer_status;
             $scope.writer = registration.writer_status;
           }
         });

       });

       $scope.event.guests = data.getList('guests').then(function(guests) {
         _.forEach(guests, function(guest) {

           $scope.event.registrations.push({
             name: guest.name,
             driver_status: guest.driver_status,
             photographer_status: guest.photographer_status,
             writer_status: guest.writer_status,
             guest_status: true,
             created_at: guest.created_at,
             avatar: 'https://www.drupal.org/files/profile_default.jpg'
           });

         });
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
         $scope.event.registrations.push({name: $scope.currentUser.first_name + ' ' + $scope.currentUser.last_name, avatar: $scope.currentUser.avatar});
         $scope.$apply();
       });
     };

     $scope.registerGuest = function(firstName, lastName, phoneNum) {
       $scope.event.post("registerGuest",
         {first_name: firstName, last_name: lastName, phone: phoneNum}).then(function(data) {
           $scope.registered = true;
           $scope.event.registrations.push({name: firstName + ' ' + lastName});
         });
     };

     $scope.unregister = function() {
       $scope.event.post("unregister").then(function() {
         $scope.registered = false;
         $scope.driving = false;
         $scope.photographer = false;
         $scope.writer = false;
         $scope.event.registrations = Events.get($stateParams.id).then(function(data) {
           $scope.event.registrations = data.getList('registrations').then(function(registrations) {
             $scope.event.registrations = registrations;
           });
         });
       });
     };

     $scope.drive = function() {
       $scope.event.all('register').patch({driver_status: true}).then(function(data) {
         $scope.driving = true;
       });
     };

     $scope.photograph = function() {
       $scope.event.all('register').patch({photographer_status: true}).then(function(data) {
         $scope.photographer = true;
       });
     };

     $scope.write = function() {
       $scope.event.all('register').patch({writer_status: true}).then(function(data) {
         $scope.writer = true;
       });
     };

     $scope.chair = function() {
       if (!$scope.isAuthorized($scope.userRoles.officer)) {
         return;
       }

       $scope.event.registrations = [];

       Restangular.all('admin').one('events',
         $stateParams.id).getList('registrations').then(function(registrations) {

           _.forEach(registrations, function(registration) {

             $scope.event.registrations.push({
               name: registration.name,
               phone: registration.phone,
               driver_status: registration.driver_status,
               guest_status: false,
               created_at: registration.created_at
             });

           });
         });

       Restangular.all('admin').one('events',
         $stateParams.id).getList('guests').then(function(registrations) {

           _.forEach(registrations, function(registration) {

             $scope.event.registrations.push({
               name: registration.name,
               phone: registration.phone,
               driver_status: registration.driver_status,
               guest_status: true,
               created_at: registration.created_at
             });

           });
         });
     };

   }]);

app.controller('EventListCtrl',
  ['$scope', '$stateParams', 'Events', 'Restangular', '$state',
   function($scope, $stateParams, Events, Restangular, $state) {
     $scope.setTitle('Events');

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

app.controller('EventSummaryCtrl',
  ['$scope', 'Events', 'Restangular',
   function($scope, Events, Restangular) {

     var today = new moment();
     var to = new moment();
     to.date(today.date() + 3);

     $scope.events = [];

     Restangular.all('events').getList({
       start: today.toISOString().replace(/\.[0-9]*/g, ''),
       end: to.toISOString().replace(/\.[0-9]*/g, '')
     }).then(function(events) {

       // Group events by start time
       var grouped = _.groupBy(events, function(item) {
         var startTime = new moment(item.start_time).hours(0).minutes(0).seconds(0).milliseconds(0);

         return startTime;
       });

       // Array of results
       var results = [];

       // Sort by date difference
       var comp = function (a, b)  { return new moment(a) - new moment(b); };

       // Sort date keys and create new array of days
       Object.keys(grouped)
         .sort(comp)
         .forEach(function(v, i) {
           var day = {
             date: v,
             events: grouped[v]
           };
           results.push(day);
         });

       $scope.results = results;
     });


   }]);

app.controller('EventWeekCtrl',
  ['$scope', 'Events', 'Restangular',
   function($scope, Events, Restangular) {

     // Set time parameters to get from now to 7 days forward
     var today = new moment();
     var to = new moment();
     to.date(today.date() + 7);

     $scope.events = [];

     // Get events
     Restangular.all('events').getList({
       start: today.toISOString().replace(/\.[0-9]*/g, ''),
       end: to.toISOString().replace(/\.[0-9]*/g, '')
     }).then(function(events) {

       // Group events by start time
       var grouped = _.groupBy(events, function(item) {
         var startTime = new moment(item.start_time).hours(0).minutes(0).seconds(0).milliseconds(0);

         return startTime;
       });

       // Array of results
       var results = [];

       // Sort by date difference
       var comp = function (a, b)  { return new moment(a) - new moment(b); };

       // Sort date keys and create new array of days
       Object.keys(grouped)
         .sort(comp)
         .forEach(function(v, i) {
           var day = {
             date: v,
             events: grouped[v]
           };
           results.push(day);
         });

       $scope.results = results;
     });


   }]);

app.controller('EventCreateCtrl',
  ['$scope', '$state', 'Restangular', function($scope, $state, Restangular) {

    $scope.event = {};
    $scope.event.startDate = new Date();
    $scope.event.endDate = new Date();
    $scope.event.openDate = new Date();
    $scope.event.closeDate = new Date();

    var create = function() {
      var values = {
        title: $scope.event.title,
        description: $scope.event.description,
        event_location: $scope.event.eventLocation,
        meeting_location: $scope.event.meetingLocation,
        start_time: $scope.event.startDate.toISOString().replace(/\.[0-9]*/g, ''),
        end_time: $scope.event.endDate.toISOString().replace(/\.[0-9]*/g, ''),
        open_time: $scope.event.openDate.toISOString().replace(/\.[0-9]*/g, ''),
        close_time: $scope.event.closeDate.toISOString().replace(/\.[0-9]*/g, '')
      };

      Restangular.all('admin').all('events').post(values).then(
        function(result) {
          $state.go('event', {id: result.id});
        },
        function() {
          console.log('There was an error!');
        }
      );
    };

    $scope.create = create;
  }]);

app.controller('EventUpdateCtrl',
  ['$scope', '$state', '$stateParams', 'Restangular', function($scope, $state, $stateParams, Restangular) {

    $scope.event = Restangular.all('admin').one('events', $stateParams.id).get().then(
      function(event) {
        $scope.event.title = event.title;
        $scope.event.description = event.description;
        $scope.event.event_location = event.event_location;
        $scope.event.meeting_location = event.meeting_location;
        $scope.event.start_time = moment(event.start_time).toDate();
        $scope.event.end_time = moment(event.end_time).toDate();
        $scope.event.open_time = moment(event.open_time).toDate();
        $scope.event.close_time = moment(event.close_time).toDate();
      }
    );

    console.log($scope.event);

    $scope.update = function() {

      var values = {
        title: $scope.event.title,
        description: $scope.event.description,
        event_location: $scope.event.event_location,
        meeting_location: $scope.event.meeting_location,
        start_time: (new Date($scope.event.start_time)).toISOString().replace(/\.[0-9]*/g, ''),
        end_time: (new Date($scope.event.end_time)).toISOString().replace(/\.[0-9]*/g, ''),
        open_time: (new Date($scope.event.open_time)).toISOString().replace(/\.[0-9]*/g, ''),
        close_time: (new Date($scope.event.close_time)).toISOString().replace(/\.[0-9]*/g, '')
      };

      Restangular.all('admin').one('events', $stateParams.id).patch(values).then(
        function(result) {
          $state.go('event', {id: result.id});
        },
        function() {
          console.log('There was an error!');
        }
      );

    };

  }]);