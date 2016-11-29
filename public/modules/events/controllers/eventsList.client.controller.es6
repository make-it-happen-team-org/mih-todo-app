'use strict';

// Events controller
angular.module('events').controller('EventsListController', ['$scope', '$stateParams', '$location', 'Authentication', 'Events',
  function ($scope, $stateParams, $location, Authentication, Events) {
    $scope.authentication = Authentication;

    $scope.$on('NEW_EVENTS_MODIFY', function () {
      $scope.find();
    });

    // Find a list of Events
    $scope.find = function () {
      $scope.events = Events.query();
    };
  }
]);
