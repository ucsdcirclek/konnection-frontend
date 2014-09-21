'use strict';

app.factory('Events', ['Restangular', function(Restangular) {
  return Restangular.all('events');
}]);
