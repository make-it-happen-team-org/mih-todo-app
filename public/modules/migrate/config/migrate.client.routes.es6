'use strict';

/** @ngInject */
let migrationRoute = ($stateProvider) => {
    $stateProvider
        .state('migrate', {
            url: '/migrate',
            views: {
                'main-view@': {
                    templateUrl: 'modules/migrate/views/migrate.view.html'
                }
            }
        })
        .state('migrate.outlook', {
            url: '/outlook',
            views: {
                'main-view@': {
                    templateUrl: 'modules/migrate/views/outlook.view.html'
                }
            }
        })
        .state('migrate.googleCalendar', {
            url: '/google-calendar',
            views: {
                'main-view@': {
                    templateUrl: 'modules/migrate/views/google-calendar.view.html'
                }
            }
        });
};

angular.module('migrate').config(migrationRoute);
