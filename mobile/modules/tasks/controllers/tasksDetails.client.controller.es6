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
            this.task.progress = this.TasksListService.recalcChart(this.task);
            this.task.duration = moment(res.days.endTime).diff(moment(res.days.startTime), 'hours');
            this.task.taskPriorityText = this.priorityForHuman(res);
        });
    }

    priorityForHuman(task) {
        let text = '';
        switch(task.priority) {
            case 1:
                text = 'Urgent and Important';
                break;
            case 2:
                text = 'Not Urgent but Important';
                break;
            case 3:
                text = 'Urgent but not Important';
                break;
            case 4:
                text = 'Not Urgent and not Important';
                break;
        }

        return text;
    }
}

angular
    .module('events')
    .controller('TasksDetailsController', TasksDetailsController);