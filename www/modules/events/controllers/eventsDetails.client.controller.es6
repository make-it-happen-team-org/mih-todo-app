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
        this.Events.get({
            eventId: this.$stateParams.eventId
        }).$promise.then((res) => {
            this.event = res;
            this.event.duration = moment(res.days.endTime).diff(moment(res.days.startTime), 'hours');
        });
    }
}

angular
    .module('events')
    .controller('EventsDetailsController', EventsDetailsController);