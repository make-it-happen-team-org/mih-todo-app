const DEFAULT_MAX_RESULTS = 10;
const DATE_FORMAT = 'yyyy-MM-dd';

class GoogleCalendarController {
    /** @ngInject */
    constructor(GoogleCalendarService, $cookies, $filter, MigrateService) {
        Object.assign(this, {
            GoogleCalendarService,
            MigrateService,
            $cookies,

            dateFormat: DATE_FORMAT,
            authorized: false,
            events: [],
            params: {
                maxResults: DEFAULT_MAX_RESULTS,
                startDate: $filter('date')(new Date(), DATE_FORMAT)
            }
        });

        this.initialize();
    }

    initialize() {
        if (this.$cookies['google_calendar_access_token'] && this.$cookies['google_calendar_refresh_token']) {
            this.params.accessToken = this.$cookies['google_calendar_access_token'];
            this.params.refreshToken = this.$cookies['google_calendar_refresh_token'];
            this.authorized = true;
        } else {
            this.GoogleCalendarService.getAuthUrl().then(data => {
                this.authUrl = data.url;
            });
        }
    }

    getEvents() {
        this.GoogleCalendarService.getCalendarEvents(this.params).then(response => {
            this.events = this.GoogleCalendarService.convertCalendarEvents(response.items);
        })
    }

    importEvents() {
        this.MigrateService.importEvents(this.events);
    }
}

angular.module('migrate').controller('GoogleCalendarController', GoogleCalendarController);