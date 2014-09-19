app.controller('AppCtrl', ['$scope', 'USER_ROLES', 'Auth', function($scope, USER_ROLES, Auth) {
  $scope.currentUser = null;
  $scope.userRoles = [0];
  $scope.isAuthorized = Auth.isAuthorized;

  $scope.setCurrentUser = function(user) {
    $scope.currentUser = user;
  };
}]);