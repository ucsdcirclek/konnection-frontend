app.controller('AppCtrl', ['$scope', 'USER_ROLES', 'Auth', '$rootScope', function($scope, USER_ROLES, Auth, $rootScope) {
  $scope.currentUser = null;
  $scope.userRoles = USER_ROLES;
  $scope.isAuthorized = Auth.isAuthorized;

  $scope.setCurrentUser = function(user) {
    $scope.currentUser = user;
  };

  $rootScope.setCurrentUser = function(user) {
    $scope.currentUser = user;
  };
}]);