// TODO Improve sort logic interaction with LocalStorage
// TODO Create universal sort static method for sorting properties

class TasksListController {
  /** @ngInject */
  constructor($scope, $filter, Authentication, Tasks) {
    Object.assign(this, { $scope, $filter, Authentication, Tasks });

    const attachEvents = () => {
      this.$scope.$on('NEW_TASK_MODIFY', () => {
        this.find();
      });
    };

    this.authentication = Authentication;
    this.tasks          = this.find();
    this.filter         = {};
    this.getFiltersFromLocalStorage();
    this.renderSortOption();

    attachEvents();
  }

  renderSortOption() {
    if (this.filter.name === 'sidebarSortByTime') {
      if(this.filter.timeSort) {
        return 'ascTime'
      }
      return 'descTime'
    }
    if (this.filter.name === 'sidebarSortByPriority') {
      if(this.filter.prioritySort) {
        return 'ascPriority'
      }
      return 'descPriority'
    }
  }

  sortListBy(type) {
    switch (type) {
    case 'priority': {
      this.setFiltersToLocalStorage('sidebarSortByPriority');
      this.filter.name         = 'sidebarSortByPriority';
      this.filter.prioritySort = !this.filter.prioritySort;
      this.tasks               = this.$filter('orderBy')(this.tasks, this.filter.prioritySort ? 'priority' : '-priority');
      break;
    }
    case 'time': {
      this.setFiltersToLocalStorage('sidebarSortByTime');
      this.filter.name     = 'sidebarSortByTime';
      this.filter.timeSort = !this.filter.timeSort;
      if (this.filter.timeSort) {
        this.tasks = TasksListController.bulbSortForEndTime(this.tasks);
      } else {
        this.tasks = TasksListController.bulbSortForEndTime(this.tasks).reverse();
      }
      this.tasks.forEach(e => {
        console.log(e.days.endTime)
      });
      break;
    }
    case 'isComplete': {
      this.setFiltersToLocalStorage('sidebarSortByComplete');
      this.filter.name  = 'sidebarSortByComplete';
      this.$scope.query = {};
      if (!this.filter.isComplete) {
        this.tasks = this.tasks.filter(el => el.isComplete);
      } else {
        this.tasks = this.tasksCopy.slice()
      }
      break;
    }
    }
  }

  find() {
    this.Tasks.query().$promise
        .then((resolved) => {
          this.tasks     = resolved;
          this.tasksCopy = resolved.slice();
        }, (rejected) => {
          console.log(rejected);
        });
  }

  getTaskDonePercentage(task) {
    return +((task.progress * 100) / task.estimation).toFixed(2);
  }

  getFiltersFromLocalStorage() {
    this.filter.name = localStorage.getItem('sidebarFilterType') || 'sidebarSortByPriority';
    this.filter.prioritySort = JSON.parse(localStorage.getItem('sidebarSortByPriority')) || true;
    this.filter.timeSort     = JSON.parse(localStorage.getItem('sidebarSortByTime')) || true;
    this.filter.isComplete   = JSON.parse(localStorage.getItem('sidebarSortByComplete')) || false;
  }

  setFiltersToLocalStorage(filterType) {
    switch (filterType) {
    case 'sidebarSortByPriority': {
      localStorage.setItem('sidebarSortByPriority', JSON.stringify(!this.filter.prioritySort));
      localStorage.setItem('sidebarFilterType', 'sidebarSortByPriority');
      break;
    }
    case 'sidebarSortByTime': {
      localStorage.setItem('sidebarSortByTime', JSON.stringify(!this.filter.timeSort));
      localStorage.setItem('sidebarFilterType', 'sidebarSortByTime');
      break;
    }
    case 'sidebarSortByComplete': {
      localStorage.setItem('sidebarSortByComplete', JSON.stringify(!this.filter.isComplete));
      localStorage.setItem('sidebarFilterType', 'sidebarSortByComplete');
      break;
    }
    }
  }

  static bulbSortForEndTime(arr){
    const len  = arr.length - 1;
    let result = arr.slice();

    for (let i = 0; i < len; i++) {
      let min = result[i].days.endTime;

      for (let j = i + 1; j < len; j++) {
        if (result[j].days.endTime < min) {
          let temp = result[i];

          min       = result[j];
          result[i] = min;
          result[j] = temp;
        }
      }
    }

    return result;
  };
}

angular
  .module('tasks')
  .controller('TasksListController', TasksListController);
