// TODO Improve sort logic interaction with LocalStorage
// TODO Create universal sort static method for sorting properties

class TasksListController {
  /** @ngInject */
  constructor($scope, $filter, Authentication, Tasks, TasksListService) {
    Object.assign(this, { $scope, $filter, Authentication, Tasks, TasksListService });

    const attachEvents = () => {
      this.$scope.$on('NEW_TASK_MODIFY', () => {
        this.find();
      });
    };

    this.authentication = Authentication;
    this.tasks          = this.find();
    this.filter         = {};
    this.filteredTasks  = this.tasks;

    attachEvents();
  }

  renderSortOption() {
    this.filter.asc = !this.filter.asc;
    
    if (this.filter.name === 'priority') {
      this.filteredTasks      = this.$filter('orderBy')(this.filteredTasks, this.filter.asc ? 'priority' : '-priority');
      this.setFiltersToLocalStorage();
    } else if (this.filter.name === 'time') {
      if (this.filter.asc) {
        this.filteredTasks = TasksListController.bulbSortForEndTime(this.filteredTasks);
      } else {
        this.filteredTasks = TasksListController.bulbSortForEndTime(this.filteredTasks).reverse();
      }
      this.setFiltersToLocalStorage();
    }
  }
  
  getSortOption() {
    return this.filter.asc ? 'asc' : 'desc';
  }

  sortListBy(type) {
    this.filter.name = type;
    
    switch(type) {
      case 'isComplete': {
        if (this.filter.isComplete) {
          this.filteredTasks = this.tasks.filter(el => el.isComplete);
        } else {
          this.filteredTasks = this.tasks;
        }
        this.setFiltersToLocalStorage();
        break;
      }
    }
  }

  find() {
    this.Tasks.query().$promise
        .then((tasks) => {
          this.tasks         = tasks;
          this.filteredTasks = tasks;
          this.progressExtend();
          this.getFiltersFromLocalStorage();
          this.sortListBy('isComplete');
          this.sortListBy(this.filter.name);
          this.setFiltersToLocalStorage();
        }, (err) => {
          console.log(err);
        });
  }

  getTaskDonePercentage(task) {
    const result = +((task.progress * 100) / task.estimation).toFixed(2);

    return result < 100 ? result : 100;
  }

  getFiltersFromLocalStorage() {
    this.filter = JSON.parse(localStorage.getItem('sidebarFilter')) || {
        name:        'time',
        asc:     true,
        isComplete:  false
      };
  }

  setFiltersToLocalStorage() {
    localStorage.setItem('sidebarFilter', JSON.stringify(this.filter));
  }

  resetCompleteFilter() {
    this.filter.isComplete = false;
    this.sortListBy('isComplete');
  }

  progressExtend() {
    _.forEach(this.filteredTasks, (value, key) => {
      this.filteredTasks[key].progress = this.TasksListService.recalcChart(value, '#879EB4', '#1AAA8F');
    });
  }

  static bulbSortForEndTime(arr) {
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
