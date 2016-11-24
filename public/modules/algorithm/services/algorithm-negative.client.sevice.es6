class AlgorithmNegative {

  /** @ngInject */
  constructor($rootScope, Slots, $timeout, ModalsService, MODALS_TASK_MESSAGES, MODALS_EVENT_MESSAGES, MODALS_EVENTS) {
    Object.assign(this, {
      $rootScope,
      Slots,
      $timeout,
      ModalsService,
      MODALS_TASK_MESSAGES,
      MODALS_EVENT_MESSAGES,
      MODALS_EVENTS
    });

    this.slotTypes = {
      task:  'task',
      event: 'event'
    };
  }

  initialize(slotType, totalAvailTime) {
    let additionalMsg = `(you need to free up ${this.estimation - totalAvailTime} h)`;
    this.openModalForDecision(slotType, additionalMsg);

    this.totalAvailHours = totalAvailTime;
    this.$rootScope.$on(this.MODALS_EVENTS.taskFirst, () => {
      this.closeModalInstance();
    });
    this.$rootScope.$on(this.MODALS_EVENTS.taskSecond, () => {
      this.getOccupiedSlots(this.startDate, this.endDate);
    });

    //this.$rootScope.$on(this.MODALS_EVENTS.eventFirst, () => { this.closeModalInstance();  });
    //this.$rootScope.$on(this.MODALS_EVENTS.eventSecond, event => { console.log('second event fired', event); });
  }

  getSlots(startDate, endDate, type) {
    return this.delegate.AlgorithmServer.get({
      q:     type,
      start: startDate,
      end:   endDate
    }).$promise;
  }

  getOccupiedSlots(startDate, endDate) {
    return new Promise(resolve => {
      this.getSlots(startDate, endDate, 'occupied-time')
          .then(res => {
            this.slotsOccupiedSlots = {
              slots: res.slots,
              tasks: res.tasks
            };

            resolve(this.slotsOccupiedSlots);

            let aggregatedTasksWithSlots = this.aggregateTasksWithSlots(this.slotsOccupiedSlots);
            this.leftTimeBeforeDeadline(aggregatedTasksWithSlots);
          });
    });
  }

  //TODO: how to decrease quantity of requests?
  recalculateExistingTasks(tasks) {
    let freeSlots = [];

    return new Promise(resolve => {
      tasks.forEach(function (value, key) {
        this.getSlots(new Date(this.startDate.setDate(this.startDate.getDate() + 1)), value.days.endTime, 'free-time')
            .then(res => {
              this.slots = res.data;
              freeSlots.push(this.slots);
              resolve(this.slots);
            });
      }, this);
    }).then(() => {
      this.$timeout(() => {
        this.findAppropriateSlotsToShift(tasks, freeSlots);
        this.closeModalInstance();
      });
    });
  }

  findAppropriateSlotsToShift(tasksToShift, freeSlots) {
    let hoursToFree = this.estimation - this.totalAvailHours;

    tasksToShift.forEach(function (value, key) {
      value.slots.futureSlots.forEach(function (v, index) {
        let slotDuration = v.duration;
        let freePlaces   = freeSlots[key];

        Object.keys(freePlaces).forEach(function (ky, ind) {
          while (hoursToFree > 0) {
            freePlaces[ky].forEach(function (val, k) {
              if (val.duration >= slotDuration) {
                hoursToFree -= slotDuration;

                value.slots.futureSlots[index].start = val.start;
                value.slots.futureSlots[index].end   = new Date(new Date(val.start).setHours(new Date(val.start).getHours() + 3)).toISOString();

                this.Slots.update(value.slots.futureSlots[index]);
                //this.delegate.$scope.apply();
              }
            }, this);
          }
        }, this);

      }, this);
    }, this);
  }

  leftTimeBeforeDeadline(tasks) {
    tasks.forEach((value, key) => {
      tasks[key].leftEstimation = tasks[key].estimation - _.sum(tasks[key].slots.passedSlots.map(value => {
          return value.duration;
        }));

      //TODO: think how to get freeTime in less expensive way
      return new Promise(resolve => {
        this.getSlots(new Date(this.startDate), new Date(tasks[key].days.endTime), 'free-time')
          .then(res => {
            tasks[key].leftHoursBeforeDeadline = this.delegate.getTotalFreeHoursInDailyMap(this.delegate.getFreeHoursDailyMapFromSlots(res.data));
            resolve(res.data);
          })
          .then(() => {
            let tasksWithShiftAbilities = this.checkShiftAbilities(tasks);
            this.recalculateExistingTasks(tasksWithShiftAbilities);
          });
      });
    }, this);
  }

  checkShiftAbilities(tasks) {
    let filteredTasks = [];

    tasks.forEach((value, key) => {
      tasks[key].canShiftWithinDeadline = (tasks[key].leftHoursBeforeDeadline - tasks[key].leftEstimation >= 0);
    });

    tasks.some(value => {
      if (value.canShiftWithinDeadline >= 0) {
        filteredTasks.push(value);
      }
    });

    return filteredTasks;
  }

  _findIndexForSlots(arr, taskId) {
    return arr.reduce((newArr, elem, index) => {
      if (elem === taskId)
        newArr.push(index);
      return newArr;
    }, []);
  }

  aggregateTasksWithSlots(data) {
    let tasks = data.tasks; //arr
    let slots = data.slots; //obj

    let concatSlots = {
      arrayOfPassedSlots: slots.passedSlots.map(value => {
        return value.taskId;
      }),
      arrayOfFutureSlots: slots.futureSlots.map(value => {
        return value.taskId;
      })
    };

    tasks.forEach((value, key) => {
      tasks[key].slots = {
        passedSlots: [],
        futureSlots: []
      };

      let indexArrPassed = this._findIndexForSlots(concatSlots.arrayOfPassedSlots, value._id);
      let indexArrFuture = this._findIndexForSlots(concatSlots.arrayOfFutureSlots, value._id);

      indexArrPassed.forEach(index => {
        tasks[key].slots.passedSlots.push(slots.passedSlots[index]);
      });
      indexArrFuture.forEach(index => {
        tasks[key].slots.futureSlots.push(slots.futureSlots[index]);
      });
    });

    return tasks;
  }

  openModalForDecision(slotType, additionalData) {
    let msg = (slotType === this.slotTypes.task) ? this.MODALS_TASK_MESSAGES : this.MODALS_EVENT_MESSAGES;

    msg.timeToFree = additionalData;
    this.ModalsService.getModalWindowOpen(msg);
  }

  closeModalInstance() {
    this.ModalsService.getModalWindowClose();
  }
}

angular.module('algorithm').service('AlgorithmNegative', AlgorithmNegative);
