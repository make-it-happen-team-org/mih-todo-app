class EventsListController {
  /** @ngInject */
  constructor($scope, Events) {
    Object.assign(this, { $scope, Events });

    const attachEvent = () => {
      this.$scope.$on('NEW_EVENTS_MODIFY', () => {
        this.find();
      });
    };

    this.events = this.Events.query();
    attachEvent();
  }

  find() {
    this.events = this.Events.query();
  }
}

angular
  .module('events')
  .controller(EventsListController);
