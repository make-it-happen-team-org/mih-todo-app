const TASKS_TAB_KEY  = 'tasks';
const EVENTS_TAB_KEY = 'events';

class TemplatesController {
  /** @ngInject */
  constructor(Authentication) {
    this.user            = Authentication.user;
    this.activeTab       = TASKS_TAB_KEY;
    this.soprtingReverse = true;
  }

  activateSortingReverse() {
    this.soprtingReverse = true;
  }

  deactivateSortingReverse() {
    this.soprtingReverse = false;
  }

  setTasksTabActive() {
    this.activeTab = TASKS_TAB_KEY;
  }

  setEventsTabActive() {
    this.activeTab = EVENTS_TAB_KEY;
  }

  isTasksTabActive() {
    return this.activeTab === TASKS_TAB_KEY;
  }

  isEventsTabActive() {
    return this.activeTab === EVENTS_TAB_KEY;
  }
}

angular.module('tasks').controller('TemplatesController', TemplatesController);
