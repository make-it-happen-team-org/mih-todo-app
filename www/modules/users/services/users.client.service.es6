angular.module('users').factory('Users', ['$resource', function ($resource) {
  return $resource('users', {}, {
    update: {
      method: 'PUT'
    }
  });
}]);
