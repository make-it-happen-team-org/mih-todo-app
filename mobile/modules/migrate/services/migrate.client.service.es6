class MigrateService {
    /** @ngInject */
    constructor($http, Events) {
        Object.assign(this, {
            Events,
            $http
        });
    }

    importEvents(events) {
        return new this.Events(events).$importEvents(response => {
            response.data.forEach(result => {
                events.forEach(event => {
                    if (event.id == result.id) {
                        event.status = result.message;
                    }
                });

                return events;
            })
        });
    }

    getImportClientPathView(viewName) {
        return '/modules/migrate/views/import-' + viewName + '.view.html';

    }
}

angular.module('migrate').service('MigrateService', MigrateService);
