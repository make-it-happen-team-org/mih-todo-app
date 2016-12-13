/** @ngInject */
let migrationRoute = ($stateProvider) => {
    $stateProvider
        .state('restricted.migrate', {
            url: '/migrate',
            views: {
                'main-view': {
                    templateUrl: 'modules/migrate/views/migrate.view.html'
                }
            }
        })
        .state('restricted.migrate.outlook', {
            url: '/outlook',
            views: {
                'main-view@restricted': {
                    templateUrl: 'modules/migrate/views/outlook.view.html'
                }
            }
        })
        .state('restricted.migrate.googleCalendar', {
            url: '/google-calendar',
            views: {
                'main-view@restricted': {
                    templateUrl: 'modules/migrate/views/google-calendar.view.html'
                }
            }
        });
};

angular.module('migrate').config(migrationRoute);
