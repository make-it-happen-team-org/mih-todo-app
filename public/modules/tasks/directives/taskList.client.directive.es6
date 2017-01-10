class TasksListDirective {
  /*@ngInject*/
  constructor() {
    this.restrict = 'A';
    this.scope = {};
    this.controller = TasksListController;
    this.controllerAs = 'taskListCtrl';
  }

  link(scope, element, attr, controller) {
    $('.sidebar__block--group-nav').on('click',(event) => {
      console.log(controller);
    });
  }
}

angular
  .module('tasks')
  .directive('tasksList', () => new TasksListDirective);