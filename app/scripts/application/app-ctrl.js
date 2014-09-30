app.controller('AppCtrl', ['$scope', 'USER_ROLES', 'Auth', '$rootScope', '$location', function($scope, USER_ROLES, Auth, $rootScope, $location) {
  $scope.currentUser = null;
  $scope.userRoles = USER_ROLES;
  $scope.isAuthorized = Auth.isAuthorized;
  $scope.lastState = null;

  $scope.setCurrentUser = function(user) {
    $scope.currentUser = user;
  };

  $scope.isActive = function(route) {
    return route === $location.path();
  };

  $rootScope.setCurrentUser = function(user) {
    $scope.currentUser = user;
  };
}]);