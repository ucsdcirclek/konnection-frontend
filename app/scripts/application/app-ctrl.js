app.controller('AppCtrl', ['$scope', 'USER_ROLES', 'Auth', '$rootScope', '$location', 'Page', function($scope, USER_ROLES, Auth, $rootScope, $location, Page) {
  $scope.currentUser = null;
  $scope.userRoles = USER_ROLES;
  $scope.isAuthorized = Auth.isAuthorized;
  $scope.lastState = null;

  $scope.Page = Page;

  $scope.setLastState = function(newState, itemId) {
    itemId = itemId || null;
    $scope.lastState = { state: newState, id: itemId };
  };

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