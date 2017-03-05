class TasksController {
  constructor($scope, $rootScope, $stateParams, $location,
              Authentication, Tasks, Users, $timeout, Algorithm,
              Slots, Notification, TasksListService) {
    $scope.authentication = Authentication;
    $scope.isATemplate = false;
    $scope.user = Authentication.user;
    $scope.selectedTemplate = false;

    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$stateParams = $stateParams;
    this.$location = $location;
    this.Authentication = Authentication;
    this.Tasks = Tasks;
    this.Users = Users;
    this.$timeout = $timeout;
    this.Algorithm = Algorithm;
    this.Slots = Slots;
    this.Notification = Notification;
    this.TasksListService = TasksListService;

    this.listen();

    let date = new Date(),
        dateMax = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));

    $scope.dt = {
      startDate: date,
      endDate: date
    };

    let d = new Date();
    d.setHours(9);
    d.setMinutes(0);

    let d2 = new Date();
    d2.setHours(18);
    d2.setMinutes(0);

    $scope.startTime = d;
    $scope.endTime = d2;

    $scope.startDate = {
      minDate: date,
      maxDate: dateMax
    };

    $scope.endDate = {
      minDate: date,
      maxDate: dateMax
    };

    $scope.clear = () => {
      return $scope.dt = null;
    };

    $scope.opened = {
      startDate: false,
      endDate: false
    };

    $scope.openStart = ($event) => {
      $event.preventDefault();
      $event.stopPropagation();
      return $scope.opened = {
        startDate: true,
        endDate: false
      };
    };
    $scope.openEnd = ($event) => {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.dt.endDate = $scope.dt.startDate;
      $scope.endDate.minDate = $scope.dt.startDate;
      return $scope.opened = {
        startDate: false,
        endDate: true
      };
    };

    $scope.dateOptions = {
      startDate: {},
      endDate: {}
    };

    $scope.getDisabledDates = (date, mode) => {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.clearSlotsList = () => {
      this.clearSlotsList()
    };

    $scope.createMode = () => {
      let newTask;

      this.clearSlotsList();

      newTask = {
        type: 'task',
        title: '',
        priority: 1,
        estimation: TasksController.getOptimalEstimation($scope.dt.startDate, $scope.dt.endDate),
        notes: '',
        days: {
          startTime: $scope.dt.startDate,
          endTime: $scope.dt.endDate
        },
        withoutDates: false
      };
      $scope.newTask = angular.copy(newTask);

      $scope.slider = TasksController.setEstimationExtremes($scope.newTask);

      $scope.changeEstimation = (updatedTask) => {
        this.updateEstimation(updatedTask);
        this.clearSlotsList();
      };

      $scope.loadTaskTemplate = (selectedTemplate) => {
        if (selectedTemplate) {
          $scope.selectedTemplate = selectedTemplate;
          $.extend($scope.newTask, selectedTemplate);
          delete $scope.newTask._id;
          delete $scope.newTask.$$hashKey;
        } else {
          $scope.selectedTemplate = false;
          $scope.newTask = angular.copy(newTask);
        }
      };

      $scope.generateSlots = () => {
        this.getNewSlots($scope.newTask)
      };

      $scope.$watch('newTask.estimation', (newVal, oldVal) => {
        if (!newVal) {
          $scope.newTask.estimation = oldVal;
        }
      });
    };

    $scope.editMode = () => {
      $scope.task = this.getTask();
    };

    $scope.create = (task) => {
      if (task) {
        let queries = [this.saveTask(task)];

        if (task.isATemplate || $scope.selectedTemplate) {
          queries.push(this.updateTaskTemplates(task));
        }

        Promise.all(queries).then(() => {
          $location.path('/');
          $rootScope.$broadcast('NEW_TASK_MODIFY');
          Notification.success(`Task '${task.title}' was successfully created`);
        });
      } else {
        console.error('Error. Task is not defined');
      }
    };

    $scope.cancel = () => {
      $location.path('/');
    };

    $scope.remove = (task) => {
      if (task) {
        task.$remove(() => {
          $location.path('/');
          $rootScope.$broadcast('NEW_TASK_MODIFY');
          this.removeSlotsByTask();
          Notification.success(`Task '${task.title}' was successfully removed`);
        });
      } else {
        console.error('Error. Task is not defined');
      }
    };

    $scope.update = (task) => {
      Tasks.getSlotsByTask({
        taskId: $stateParams.taskId
      }).$promise.then(function (slots) {
        slots.forEach((slot) => {

          slot.title = task.title;
          slot.className = ['task', `task-priority-${task.priority}`];

          Slots.update({_id: slot._id}, slot);
        });
      });
      if (task) {
        task.$update(() => {
          $location.path('tasks/' + task._id);
          $rootScope.$broadcast('NEW_TASK_MODIFY');
          Notification.success(`Task '${task.title}' was successfully updated`);
        }, (errorResponse) => {
          $scope.error = errorResponse.data.message;
        });
      } else {
        console.error('Error. Task is not defined');
      }
    };

    $scope.initCreateSlots = () => {
      $scope.createSlot = true;
    };

    $scope.isOverdueSlot = (item) => {
      return (Date.parse(item.start) + 3600000 * item.duration) <= new Date().valueOf();
    };

    $scope.completeSlot = (slot) => {
      this.updateProgress(slot, $scope.task);
    };
  }

  static getEstimationDaysRange (startDate, endDate) {
    let weekDay             = new Date(startDate),
        estimationDaysRange = [weekDay];

    endDate                 = new Date(endDate);

    while (weekDay < endDate) { //Get all days for this period
      estimationDaysRange.push(weekDay);
      weekDay = new Date(weekDay.setDate(weekDay.getDate() + 1));
    }

    return estimationDaysRange;
  }

  static getMaxEstimation (startDate, endDate) {
    return TasksController.getEstimationDaysRange(startDate, endDate).length * 12;
  }

  static getOptimalEstimation (startDate, endDate) {
    // TODO: what is considered optimal?
    let optimalEstimation = 1 /* hour */;
    return optimalEstimation;
  }

  removeAvailHoursInfo () {
    delete this.$scope.timeAvailability;
  }

  updateEstimation (model) {
    let maxEstimation = TasksController.getMaxEstimation(model.days.startTime, model.days.endTime);
    this.$scope.slider.options.ceil = maxEstimation;
    if (model.estimation > maxEstimation) {
      model.estimation = maxEstimation;
    }
    this.removeAvailHoursInfo();
  };

  static setEstimationExtremes (model) {
    return {
      options: {
        floor: 1,
        ceil: TasksController.getMaxEstimation(new Date(model.days.startTime), new Date(model.days.endTime)),
        translate: function translate(unit) {
          return unit + 'h';
        }
      }
    };
  };

  getNewSlots (model) {
    this.Algorithm.generateSlots(
        new Date(model.days.startTime),
        new Date(model.days.endTime),
        model.priority,
        model.estimation,
        this.$scope.user.predefinedSettings.workingHours
    ).then(slotsRange => {
      this.$timeout(() => {
        this.$scope.timeAvailability = this.Algorithm.getTimeAvailabilityFromSlotsGroupedByDays();
        if (!slotsRange.length) {
          this.Algorithm.AlgorithmNegative.initialize('task', this.$scope.timeAvailability.totalAvailHours);
        }
        return this.$scope.slotsRange = slotsRange;
      });
    });
  };

  removeSlotsByTask () {
    this.Tasks.deleteSlotsByTask({
          taskId: this.$stateParams.taskId
        }
    );
  };

  updateProgress (slot, task) {
    slot.isComplete = true;

    this.Slots.update(slot, () => {
      let slotsQty = this.$scope.slotsRange.map(function (slot) {
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

  clearSlotsList () {
    if (this.$scope.slotsRange && this.$scope.slotsRange.length) {
      this.$scope.slotsRange = [];
      this.Notification.info('Don\'t forget to generate slots');
    }
  };

  getSlotsByTask () {
    return this.Tasks.getSlotsByTask({
          taskId: this.$stateParams.taskId
        }, (slots) => {
          if (!slots.length) {
            this.$scope.progress = false;
            return;
          }
        }
    );
  };

  getTask(cb) {
    return this.Tasks.get({
      taskId: this.$stateParams.taskId
    }, () => {
      if (cb) {
        cb();
      }
    });
  };

  saveTask (model) {
    return new Promise(resolve => {
      let task = new this.Tasks(model);

      if (model.withoutDates) {
        task.days.startTime = task.days.endTime = '';
      }

      task.$save((response) => {
        let slots;

        this.$scope.slotsRange.map(slot => {
          slot.taskId    = response._id;
          slot.userId    = this.Authentication.user._id;
          slot.title     = response.title;
          slot.className = ['task', `task-priority-${model.priority}`];
        });
        slots = new this.Slots(this.$scope.slotsRange);
        slots.$save(resolve);
      }, (errorResponse) => {
        this.$scope.validationError = errorResponse.data.message.errors;
      });
    });
  };

  updateTaskTemplates (model) {
    return new Promise(resolve => {
      let user = new this.Users(this.$scope.user);

      if (this.$scope.selectedTemplate) {
        user.taskTemplates.forEach(template => {
          if (template === this.$scope.selectedTemplate) {
            template.lastUsingDate = new Date();
          }
        });
      }

      if (model.isATemplate) {
        model.lastUsingDate = new Date();
        user.taskTemplates.push(model);
      }

      user.$update(response => {
        this.Authentication.user = response;
        resolve();
      }, err => console.error(err));
    });
  };

  listen() {
    this.$scope.$on('COMPLETED_SLOT_FROM_OVERDUE', () => {
      this.$timeout(() => {
        this.$scope.task = this.getTask();
        this.$scope.slotsRange = this.getSlotsByTask();
      });
    });

    this.$scope.$on('slideEnded', () => {
      this.clearSlotsList();
      this.$scope.$apply();
    });

    this.$scope.$on('slotShiftedFromNegative', () => {
      let model = this.$scope.newTask;

      this.Algorithm.generateSlots(
          new Date(model.days.startTime),
          new Date(model.days.endTime),
          model.priority,
          model.estimation,
          this.$scope.user.predefinedSettings.workingHours
      ).then(slotsRange => {
        if (!slotsRange.length) {
          return;
        }
        this.$scope.slotsRange = slotsRange;

        let queries = [this.saveTask(model)];

        if (model.isATemplate || this.$scope.selectedTemplate) {
          queries.push(this.updateTaskTemplates(model));
        }

        Promise.all(queries).then(() => {
          this.$location.path('/');
          this.$rootScope.$broadcast('NEW_TASK_MODIFY');
          this.Notification.success(`Task '${model.title}' was successfully created`);
        });
      });
    });
  }
}

TasksController.$inject = ['$scope', '$rootScope', '$stateParams', '$location',
  'Authentication', 'Tasks', 'Users', '$timeout', 'Algorithm', 'Slots', 'Notification', 'TasksListService'];

angular.module('tasks').controller('TasksController', TasksController);