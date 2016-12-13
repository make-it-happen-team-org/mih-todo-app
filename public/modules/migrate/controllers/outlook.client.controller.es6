const DATE_FORMAT = 'yyyy-MM-dd';

class OutlookMigrateController {
    /** @ngInject */
    constructor(OutlookService, $cookies, $filter, MigrateService) {
        Object.assign(this, {
            OutlookService,
            MigrateService,
            $cookies,

            dateFormat: DATE_FORMAT,
            authorized: false,
            events: [],
            params: {
                startDateTime: $filter('date')(new Date(), DATE_FORMAT),
                endDateTime: $filter('date')(new Date(), DATE_FORMAT)
            }
        });

        this.initialize();
    }

    initialize() {
        if (this.$cookies['outlook_access_token'] && this.$cookies['outlook_email']) {
            this.params.token = this.$cookies['outlook_access_token'];
            this.params.email = this.$cookies['outlook_email'];
            this.authorized = true;
        } else {
            this.OutlookService.getAuthUrl().then(data => {
                this.authUrl = data.url;
            });
        }
    }

    getOutlookCalendarEvents() {
        this.OutlookService.getCalendarEvents(this.params).then(events => {
            this.events = this.OutlookService.convertCalendarEvents(events);
        })
    }

    importEvents() {
        this.MigrateService.importEvents(this.events);
    }
}

angular.module('migrate').controller('OutlookMigrateController', OutlookMigrateController);
