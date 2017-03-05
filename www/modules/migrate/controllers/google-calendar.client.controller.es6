class GoogleCalendarController {
  /** @ngInject */
  constructor(GoogleCalendarService, MigrateService, MigrateConstants, $cookies, $filter, $stateParams) {
    Object.assign(this, {
      GoogleCalendarService,
      MigrateService,
      MigrateConstants,
      $cookies,
      dateFormat:     MigrateConstants.dateFormat,
      authorized:     false,
      getEventsError: true,
      events:         [],
      params:         {
        viewPath:   MigrateService.getImportClientPathView($stateParams.client),
        maxResults: MigrateConstants.google.limitEvents,
        startDate:  $filter('date')(new Date(), MigrateConstants.dateFormat)
      }
    });

    this.initialize();
  }

  initialize() {
    if (this.$cookies[this.MigrateConstants.google.token.access] && this.$cookies[this.MigrateConstants.google.token.refresh]) {
      this.params.accessToken  = this.$cookies[this.MigrateConstants.google.token.access];
      this.params.refreshToken = this.$cookies[this.MigrateConstants.google.token.refresh];
      this.authorized          = true;
      this.getEventsError      = false;
    } else {
      this.GoogleCalendarService.getAuthUrl().then(data => {
        this.authUrl = data.url;
      }, () => {
        this.authUrl    = null;
        this.authorized = false;
      });
    }
  }

  deleteClientCookies() {
    delete this.$cookies[this.MigrateConstants.google.token.access];
    delete this.$cookies[this.MigrateConstants.google.token.refresh];
  }

  getEvents() {
    this.GoogleCalendarService.getCalendarEvents(this.params).then(response => {
      this.events = this.GoogleCalendarService.convertCalendarEvents(response.items);
    }, () => {
      this.getEventsError = true;
    });
  }

  importEvents() {
    this.MigrateService.importEvents(this.events);
  }
}

angular.module('migrate').controller('GoogleCalendarController', GoogleCalendarController);