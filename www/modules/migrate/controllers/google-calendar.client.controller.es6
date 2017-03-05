class GoogleCalendarController {
  /** @ngInject */
  constructor(GoogleCalendarService, $cookies, $filter, $stateParams, MigrateService, MigrateConstants) {
    Object.assign(this, {
      GoogleCalendarService,
      MigrateService,
      $cookies,
      dateFormat:     MigrateConstants.dateFormat,
      authorized:     false,
      getEventsError: true,
      events:         [],
      params:         {
        viewPath:   MigrateService.getImportClientPathView($stateParams.client),
        maxResults: MigrateConstants.limitEvents,
        startDate:  $filter('date')(new Date(), MigrateConstants.dateFormat)
      }
    });

    this.initialize();
  }

  initialize() {
    if (this.$cookies['google_calendar_access_token'] && this.$cookies['google_calendar_refresh_token']) {
      this.params.accessToken  = this.$cookies['google_calendar_access_token'];
      this.params.refreshToken = this.$cookies['google_calendar_refresh_token'];
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
    delete this.$cookies['google_calendar_access_token'];
    delete this.$cookies['google_calendar_refresh_token'];
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