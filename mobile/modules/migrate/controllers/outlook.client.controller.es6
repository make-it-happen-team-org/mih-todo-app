const DATE_FORMAT = 'yyyy-MM-dd';

class OutlookMigrateController {
    /** @ngInject */
    constructor(OutlookService, $cookies, $filter, $stateParams, MigrateService) {
        Object.assign(this, {
            OutlookService,
            MigrateService,
            $cookies,
            dateFormat: DATE_FORMAT,
            authorized: false,
            getEventsError: true,
            events: [],
            params: {
                viewPath: MigrateService.getImportClientPathView($stateParams.client),
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
            this.getEventsError = false;
        } else {
            this.OutlookService.getAuthUrl().then(data => {
                this.authUrl = data.url;
            }, ()=> {
                this.authUrl = null;
                this.authorized = false;
            });
        }
    }

    deleteClientCookies() {
        delete this.$cookies['outlook_access_token'];
        delete this.$cookies['outlook_email'];
    }

    getEvents() {
        this.OutlookService.getCalendarEvents(this.params).then(events => {
            this.events = this.OutlookService.convertCalendarEvents(events);
        }, ()=> {
            this.getEventsError = true;
        });
    }

    importEvents() {
        this.MigrateService.importEvents(this.events);
    }
}

angular.module('migrate').controller('OutlookMigrateController', OutlookMigrateController);
