class EventsDetailsController {
    /** @ngInject */
    constructor($scope, Events, $stateParams) {
        Object.assign(this, { $scope, Events, $stateParams });

        const attachEvent = () => {
            this.$scope.$on('NEW_EVENTS_MODIFY', () => {
                this.showEvent();
            });
        };

        this.isOpenNotes = false;
        this.event = {};
        this.showEvent();
        attachEvent();
    }

    showEvent() {
        this.event = this.Events.get({
            eventId: this.$stateParams.eventId
        });
    }
}

angular
    .module('events')
    .controller('EventsDetailsController', EventsDetailsController);