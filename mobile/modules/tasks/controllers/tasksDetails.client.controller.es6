class TasksDetailsController {
    /** @ngInject */
    constructor($scope, Tasks, $stateParams, TasksListService) {
        Object.assign(this, { $scope, Tasks, $stateParams, TasksListService });

        const attachEvent = () => {
            this.$scope.$on('NEW_TASK_MODIFY', () => {
                this.showTask();
            });
        };

        this.isOpenNotes = false;
        this.isOpenTimeSlots = false;
        this.task = {};

        this.showTask();
        attachEvent();
    }

    showTask() {
        this.Tasks.get({
            taskId: this.$stateParams.taskId
        }).$promise.then((res) => {
            this.task = res;
            this.task.progress = this.TasksListService.recalcChart(this.task, '#172837', '#1AAA8F');
            this.task.duration = moment(res.days.endTime).diff(moment(res.days.startTime), 'hours');
            this.task.taskPriorityText = this.priorityForHuman(res);
        });
    }

    priorityForHuman(task) {
        let priorityMap = [
            'Urgent and Important',
            'Not Urgent but Important',
            'Urgent but not Important',
            'Not Urgent and not Important'
        ];

        return priorityMap[task.priority - 1];
    }
}

angular
    .module('events')
    .controller('TasksDetailsController', TasksDetailsController);