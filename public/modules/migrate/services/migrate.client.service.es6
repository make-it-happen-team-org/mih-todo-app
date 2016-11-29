class MigrateService {
    /** @ngInject */
    constructor($http, Events) {
        Object.assign(this, {
            Events,
            $http
        });
    }

    importEvents(evets) {
        return new this.Events(evets).$importEvents(response => {
            response.data.forEach(result => {
                evets.forEach(event => {
                    if (event.id == result.id) {
                        event.status = result.message;
                    }
                });

                return evets;
            })
        });
    }
}

angular.module('migrate').service('MigrateService', MigrateService);
