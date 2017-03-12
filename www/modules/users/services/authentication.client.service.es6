angular.module('users').factory('Authentication', ['$window', function ($window) {
  let auth = {
    user: $window.user
  };

  return auth;
}]);
