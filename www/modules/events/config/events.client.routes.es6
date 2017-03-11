angular.module('events').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('restricted.todo_state.events', {
        url:      '/events',
        abstract: true
      })
      .state('restricted.todo_state.events.list', {
        url:   '/list',
        views: {
          'main-view@restricted': {
            templateUrl: 'modules/events/views/list-events.client.view.html'
          }
        }
      })
      .state('restricted.todo_state.events.details', {
        url:   '/:eventId/details',
        views: {
          'main-view@restricted': {
            templateUrl: 'modules/events/views/details-event.client.view.html'
          }
        }
      })
      .state('restricted.todo_state.events.create', {
        url:    '/create?eventPresetType',
        params: {
          eventPresetType: undefined
        },
        views:  {
          'main-view@restricted': {
            templateUrl: 'modules/events/views/create-event.client.view.html'
          }
        }
      })
      .state('restricted.todo_state.events.edit', {
        url:   '/:eventId/edit',
        views: {
          'main-view@restricted': {
            templateUrl: 'modules/events/views/edit-event.client.view.html'
          }
        }
      })
    ;
  }
]);
