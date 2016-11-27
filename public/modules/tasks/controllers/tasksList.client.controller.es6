class TasksListController {
  /** @ngInject */
  constructor($rootScope, Authentication, Tasks) {
    Object.assign(this, { $rootScope, Authentication, Tasks });

    const attachEvents = () => {
      this.$rootScope.$on('NEW_TASK_MODIFY', () => {
        this.find();
      });
    };

    this.authentication = Authentication;
    this.tasks          = Tasks.query();
    this.status         = { isComplete: false };
    TasksListController.getFromLocalStorage();

    attachEvents();
  }

  sortListBy(type) {
    TasksListController.saveToLocalStorage(type);
    this.sortType    = type;
    this.sortReverse = !this.sortReverse;
  }

  find() {
    this.tasks = this.Tasks.query();
  }

  static getTaskDonePercentage(task) {
    return +((task.progress * 100) / task.estimation).toFixed(2);
  }

  static saveToLocalStorage(type) {
    localStorage.setItem('sidebarTodoSortOrderBy', type);
    localStorage.setItem('sidebarTodoSortOrderReverse', !this.sortReverse);
  }

  static getFromLocalStorage() {
    this.sortType    = localStorage.getItem('sidebarTodoSortOrderBy') || 'days.endTime';
    this.sortReverse = localStorage.getItem('sidebarTodoSortOrderReverse') || false;
  }
}

angular.module('tasks').controller('TasksListController', TasksListController);
