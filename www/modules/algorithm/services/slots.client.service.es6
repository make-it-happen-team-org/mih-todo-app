angular.module('algorithm').factory('Slots', ['$resource',
  function ($resource) {
    return $resource('slots/:slotId', { slotId: '@_id' },
      {
        update: {
          method: 'PUT'
        }
      }
    );
  }
]);
