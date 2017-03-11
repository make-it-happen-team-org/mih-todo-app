class OutlookMigrateController {
  /** @ngInject */
  constructor(OutlookService, MigrateService, MigrateConstants, $cookies, $filter, $stateParams) {
    Object.assign(this, {
      OutlookService,
      MigrateService,
      MigrateConstants,
      $cookies,
      dateFormat:     MigrateConstants.dateFormat,
      authorized:     false,
      getEventsError: true,
      events:         [],
      params:         {
        viewPath:      MigrateService.getImportClientPathView($stateParams.client),
        startDateTime: $filter('date')(new Date(), MigrateConstants.dateFormat),
        endDateTime:   $filter('date')(new Date(), MigrateConstants.dateFormat)
      }
    });

    this.initialize();
  }

  initialize() {
    if (this.$cookies[this.MigrateConstants.outlook.token.access] && this.$cookies[this.MigrateConstants.outlook.email]) {
      this.params.token   = this.$cookies[this.MigrateConstants.outlook.token.access];
      this.params.email   = this.$cookies[this.MigrateConstants.outlook.email];
      this.authorized     = true;
      this.getEventsError = false;
    } else {
      this.OutlookService.getAuthUrl().then(data => {
        this.authUrl = data.url;
      }, () => {
        this.authUrl    = null;
        this.authorized = false;
      });
    }
  }

  deleteClientCookies() {
    delete this.$cookies[this.MigrateConstants.outlook.token.access];
    delete this.$cookies[this.MigrateConstants.outlook.email];
  }

  getEvents() {
    this.OutlookService.getCalendarEvents(this.params).then(events => {
      this.events = this.OutlookService.convertCalendarEvents(events);
    }, () => {
      this.getEventsError = true;
    });
  }

  importEvents() {
    this.MigrateService.importEvents(this.events);
  }
}

angular.module('migrate').controller('OutlookMigrateController', OutlookMigrateController);
