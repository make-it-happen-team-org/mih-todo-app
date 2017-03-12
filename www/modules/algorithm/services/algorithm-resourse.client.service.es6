angular.module('algorithm').factory('AlgorithmServer', ['$resource',
  function ($resource) {
    return $resource('algorithm/:q', {});
  }
]);
