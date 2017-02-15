class TasksDetailsController {
    /** @ngInject */
    constructor($scope, Tasks, $stateParams) {
        Object.assign(this, { $scope, Tasks, $stateParams });

        const attachEvent = () => {
            this.$scope.$on('NEW_TASK_MODIFY', () => {
                this.showTask();
            });
        };

        this.isOpenNotes = false;
        this.task = {};

        this.showTask();
        attachEvent();
    }

    showTask() {
        this.task = this.Tasks.get({
            taskId: this.$stateParams.taskId
        });
    }
}

angular
    .module('events')
    .controller('TasksDetailsController', TasksDetailsController);