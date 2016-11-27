class EventsListController {
  /** @ngInject */
  constructor($rootScope, Events) {
    Object.assign(this, { $rootScope, Events });

    const attachEvents = () => {
      this.$rootScope.$on('NEW_EVENTS_MODIFY', () => {
        this.find();
      });
    };

    this.events = this.Events.query();
    attachEvents();
  }

  find() {
    this.events = this.Events.query();
  }
}

angular
  .module('events')
  .controller(EventsListController);
