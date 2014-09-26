app.controller('AppCtrl', ['$scope', 'USER_ROLES', 'Auth', function($scope, USER_ROLES, Auth) {
  $scope.currentUser = null;
  $scope.userRoles = USER_ROLES;
  $scope.isAuthorized = Auth.isAuthorized;

  $scope.setCurrentUser = function(user) {
    $scope.currentUser = user;
  };
}]);