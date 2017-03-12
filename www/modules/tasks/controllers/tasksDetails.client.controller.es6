class TasksDetailsController {
  /** @ngInject */
  constructor($scope, $rootScope, Tasks, Slots, $stateParams, TasksListService) {
    Object.assign(this, { $scope, $rootScope, Tasks, Slots, $stateParams, TasksListService });

    const attachEvent = () => {
      this.$scope.$on('NEW_TASK_MODIFY', () => {
        this.showTask();
      });
    };

    this.isOpenNotes     = false;
    this.isOpenTimeSlots = false;
    this.task            = {};
    this.slotsRange      = [];
    this.progress        = true;

    this.showTask();
    this.getSlotsByTask();
    attachEvent();
  }

  showTask() {
    this.Tasks.get({
      taskId: this.$stateParams.taskId
    }).$promise.then((res) => {
      this.task                  = res;
      this.task.progress         = this.TasksListService.recalcChart(this.task, '#172837', '#1AAA8F');
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

  getSlotsByTask() {
    this.Tasks.getSlotsByTask({
        taskId: this.$stateParams.taskId
      }, (slots) => {
        if (!slots.length) {
          this.progress = false;
          return;
        }
        this.slotsRange = slots;
        return slots;
      }
    );
  }

  isOverdueSlot(item) {
    return (Date.parse(item.start) + 3600000 * item.duration) <= new Date().valueOf();
  }

  completeSlot(slot) {
    this.updateProgress(slot, this.task);
  }

  updateProgress(slot, task) {
    slot.isComplete = true;

    this.Slots.update(slot, () => {
      let slotsQty         = this.slotsRange.map((slot) => {
        return slot.isComplete;
      });
      let completeSlotsQty = slotsQty.filter(Boolean);

      task.progress += slot.duration;

      if (slotsQty.length === completeSlotsQty.length) {
        task.isComplete = true;
      }

      task.$update(() => {
        this.$rootScope.$broadcast('NEW_TASK_MODIFY');
      }, (errorResponse) => {
        this.$scope.error = errorResponse.data.message;
      });
    });
  };

}

angular
  .module('events')
  .controller('TasksDetailsController', TasksDetailsController);