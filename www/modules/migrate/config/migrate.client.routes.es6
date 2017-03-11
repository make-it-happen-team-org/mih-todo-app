/** @ngInject */
let migrationRoute = ($stateProvider) => {
  $stateProvider
    .state('restricted.migrate', {
      url:   '/migrate',
      views: {
        'main-view': {
          templateUrl: 'modules/migrate/views/migrate.view.html'
        }
      }
    })
    .state('restricted.migrate.outlook', {
      url:    '/outlook',
      params: { client: 'outlook' },
      views:  {
        'main-view@restricted': {
          templateUrl:  'modules/migrate/views/import-events.view.html',
          controller:   'OutlookMigrateController',
          controllerAs: 'ctrl'
        }
      }
    })
    .state('restricted.migrate.googleCalendar', {
      url:    '/google-calendar',
      params: { client: 'gmail' },
      views:  {
        'main-view@restricted': {
          templateUrl:  'modules/migrate/views/import-events.view.html',
          controller:   'GoogleCalendarController',
          controllerAs: 'ctrl'
        }
      }
    });
};

angular.module('migrate').config(migrationRoute);
