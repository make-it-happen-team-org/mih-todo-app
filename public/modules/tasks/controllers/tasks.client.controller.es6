class TasksController {
  constructor($scope, $rootScope, $stateParams, $location,
              Authentication, Tasks, Users, $timeout, Algorithm,
              Slots, Notification) {
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
        estimation: getOptimalEstimation($scope.dt.startDate, $scope.dt.endDate),
        notes: '',
        days: {
          startTime: $scope.dt.startDate,
          endTime: $scope.dt.endDate
        },
        withoutDates: false
      };
      $scope.newTask = angular.copy(newTask);

      $scope.slider = setEstimationExtremes($scope.newTask);

      $scope.changeEstimation = (updatedTask) => {
        updateEstimation(updatedTask);
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
        getNewSlots($scope.newTask)
      };

      $scope.$watch('newTask.estimation', (newVal, oldVal) => {
        if (!newVal) {
          $scope.newTask.estimation = oldVal;
        }
      });
    };

    $scope.editMode = () => {
      $scope.task = this.getTask(() => {
        $scope.slider = setEstimationExtremes($scope.task);
      });

      $scope.getSlotsByTask = () => {
        $scope.slotsRange = this.getSlotsByTask();
      };

      $scope.generateSlots = () => {
        getNewSlots($scope.task);
      };
      $scope.changeEstimation = (updatedTask) => {
        updateEstimation(updatedTask);
        this.clearSlotsList();
      };
    };

    function getEstimationDaysRange(startDate, endDate) {
      let weekDay = new Date(startDate),
          estimationDaysRange = [weekDay];
      endDate = new Date(endDate);

      while (weekDay < endDate) { //Get all days for this period
        estimationDaysRange.push(weekDay);
        weekDay = new Date(weekDay.setDate(weekDay.getDate() + 1));
      }

      return estimationDaysRange;
    }

    function getMaxEstimation(startDate, endDate) {
      return getEstimationDaysRange(startDate, endDate).length * 12;
    }

    function getOptimalEstimation(startDate, endDate) {
      // TODO: what is considered optimal?
      let optimalEstimation = 1 /* hour */;
      return optimalEstimation;
    }

    function removeAvailHoursInfo() {
      delete $scope.timeAvailability;
    }

    let updateEstimation = (model) => {
      let maxEstimation = getMaxEstimation(model.days.startTime, model.days.endTime);
      $scope.slider.options.ceil = maxEstimation;
      if (model.estimation > maxEstimation) {
        model.estimation = maxEstimation;
      }
      removeAvailHoursInfo();
    };

    let setEstimationExtremes = (model) => {
      return {
        options: {
          floor: 1,
          hideLimitLabels: true,
          ceil: getMaxEstimation(new Date(model.days.startTime), new Date(model.days.endTime)),
          translate: function translate(unit) {
            return unit + 'h';
          }
        }
      };
    };

    let getNewSlots = (model) => {

      Algorithm.generateSlots(
        new Date(model.days.startTime),
        new Date(model.days.endTime),
        model.priority,
        model.estimation,
        $scope.user.predefinedSettings.workingHours
      ).then(slotsRange => {
        $timeout(() => {
          $scope.timeAvailability = Algorithm.getTimeAvailabilityFromSlotsGroupedByDays();
          if (!slotsRange.length) {
            Algorithm.AlgorithmNegative.initialize('task', $scope.timeAvailability.totalAvailHours);
          }
          return $scope.slotsRange = slotsRange;
        });
      });
    };

    let removeSlotsByTask = () => {
      Tasks.deleteSlotsByTask({
          taskId: $stateParams.taskId
        }
      );
    };

    let updateProgress = (slot, task) => {
      slot.isComplete = true;

      Slots.update(slot, () => {
        let slotsQty = $scope.slotsRange.map(function (slot) {
          return !!slot.isComplete;
        });
        let completeSlotsQty = slotsQty.filter(Boolean);

        task.progress += slot.duration;

        if (slotsQty.length === completeSlotsQty.length) {
          task.isComplete = true;
        }

        task.$update(() => {
          this.recalcChart();
          $rootScope.$broadcast('NEW_TASK_MODIFY');
        }, (errorResponse) => {
          $scope.error = errorResponse.data.message;
        });
      });
    };

    $scope.create = (task) => {
      if (task) {
        let queries = [saveTask(task)];

        if (task.isATemplate || $scope.selectedTemplate) {
          queries.push(updateTaskTemplates(task));
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
          removeSlotsByTask();
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
      updateProgress(slot, $scope.task);
    };
  }

  clearSlotsList () {
    if (this.$scope.slotsRange && this.$scope.slotsRange.length) {
      this.$scope.slotsRange = [];
      this.Notification.info('Don\'t forget to generate slots');
    }
  };

  getFormattedProgress () {
    let complete   = this.$scope.task.progress;
    let estimation = this.$scope.task.estimation;

    return {
      percent: +(complete / estimation * 100).toFixed(2),
      left:    estimation - complete,
      done:    complete
    };
  };

  recalcChart () {
    let progress = this.getFormattedProgress();

    this.$scope.progress = angular.extend(progress, {
      progressChart: {
        data:      [{
          value: progress.percent,
          label: 'Done'
        }, {
          value: 100 - progress.percent,
          label: 'Left'
        }],
        colors:    ['#1ab394', '#f8ac59'],
        formatter: function formatter(input) {
          return input + '%';
        }
      }
    });
  };

  getSlotsByTask () {
    return this.Tasks.getSlotsByTask({
        taskId: this.$stateParams.taskId
      }, (slots) => {
        if (!slots.length) {
          this.$scope.progress = false;
          return;
        }
        this.$timeout(() => {
          this.recalcChart();
        }, 100);
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
        slots = new Slots($scope.slotsRange);
        slots.$save(resolve);
      }, (errorResponse) => {
        this.$scope.validationError = errorResponse.data.message.errors;
      });
    });
  };

  updateTaskTemplates (model) {
    return new Promise(resolve => {
      let user = new Users(this.$scope.user);

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
    this.$scope.$on('COMPLETED_SLOT_FROM_OVERDUE', function () {
      this.$timeout(() => {
        this.$scope.task = this.getTask();
        this.$scope.slotsRange = this.getSlotsByTask();
      });
    });

    this.$scope.$on('slideEnded', function () {
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
  'Authentication', 'Tasks', 'Users', '$timeout', 'Algorithm', 'Slots', 'Notification'];

angular.module('tasks').controller('TasksController', TasksController);