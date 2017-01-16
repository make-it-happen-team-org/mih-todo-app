class OutlookService {
    /** @ngInject */
    constructor($http) {
        Object.assign(this, {
            $http
        });
    }

    getAuthUrl() {
        return this.$http.get('migrate/outlook/get-auth-url').then(responce => responce.data);
    }

    getCalendarEvents(params) {
        return this.$http.get('migrate/outlook/get-calendar-events', {params}).then(responce => responce.data);
    }

    convertCalendarEvents(events) {
        return events.map(event => {
            return {
                id: event.Id,
                type: 'event',
                title: event.Subject || 'No name',
                notes: event.BodyPreview,
                days: {
                    startTime: event.Start.DateTime,
                    endTime: event.End.DateTime
                }
            }
        });
    }
}

angular.module('migrate').service('OutlookService', OutlookService);
