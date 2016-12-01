class GoogleCalendarService {
    /** @ngInject */
    constructor($http) {
        Object.assign(this, {
            $http
        });
    }

    getAuthUrl() {
        return this.$http.get('/migrate/google-calendar/get-auth-url').then(responce => responce.data);
    }

    getCalendarEvents(params) {
        return this.$http.get('/migrate/google-calendar/get-calendar-events', {params}).then(responce => responce.data);
    }

    convertCalendarEvents(events) {
        return events.map(event => {
            return {
                id: event.id,
                type: 'event',
                title: event.summary,
                notes: event.description,
                days: {
                    startTime: event.start.date,
                    endTime: event.end.date
                }
            }
        });
    }
}

angular.module('migrate').service('GoogleCalendarService', GoogleCalendarService);
