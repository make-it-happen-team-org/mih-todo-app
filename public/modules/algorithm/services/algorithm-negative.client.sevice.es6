class AlgorithmNegative {

  /** @ngInject */
  constructor($rootScope, Slots, $timeout, ModalsService, MODALS_TASK_MESSAGES, MODALS_EVENT_MESSAGES) {
    Object.assign(this, {
      $rootScope,
      Slots,
      $timeout,
      ModalsService,
      MODALS_TASK_MESSAGES,
      MODALS_EVENT_MESSAGES
    });

    this.slotTypes = {
      task:  'task',
      event: 'event'
    };
  }

  initialize(slotType, totalAvailTime) {
    this.openModalForDecision(slotType, `(you need to free up ${this.estimation - totalAvailTime} h)`);
    this.totalAvailHours = totalAvailTime;
  }

  getOccupiedSlots(startDate, endDate) {
    console.log('root', this.$rootScope);

    return new Promise(resolve => {
      this.delegate.getSlots(startDate, endDate, 'occupied-time')
        .then(res => {
          this.slotsOccupiedSlots = {
            slots: res.slots,
            tasks: res.tasks
          };

          resolve(this.slotsOccupiedSlots);
          return this.aggregateTasksWithSlots(this.slotsOccupiedSlots);
        })
        .then((aggregatedTasksWithSlots) => {
          this.leftTimeBeforeDeadline(aggregatedTasksWithSlots);
        });
    });
  }

  _findIndexForSlots(arr, taskId) {
    return arr.reduce((newArr, elem, index) => {
      if (elem === taskId)
        newArr.push(index);
      return newArr;
    }, []);
  }

  /**
   *
   * @param data
   * @returns {Array} tasks
   * @description Gets object with slots and tasks from promise and aggregates each task with its slots
   * so each task has field slots with passed and future slots
   */
  aggregateTasksWithSlots(data) {
    let tasks = data.tasks; //arr
    let slots = data.slots; //obj

    let concatSlots = {
      arrayOfPassedSlots: slots.passedSlots.map(value => { return value.taskId; }),
      arrayOfFutureSlots: slots.futureSlots.map(value => { return value.taskId; })
    };

    tasks.forEach((value, key) => {
      tasks[key].slots = {
        passedSlots: [],
        futureSlots: []
      };

      let indexArrPassed = this._findIndexForSlots(concatSlots.arrayOfPassedSlots, value._id);
      let indexArrFuture = this._findIndexForSlots(concatSlots.arrayOfFutureSlots, value._id);

      indexArrPassed.forEach(index => { tasks[key].slots.passedSlots.push(slots.passedSlots[index]); });
      indexArrFuture.forEach(index => { tasks[key].slots.futureSlots.push(slots.futureSlots[index]); });
    });

    return tasks;
  }

  /**
   *
   * @param tasks
   * @returns {Array}
   * @description Gets tasks array and calculates left working time before deadline.
   */
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

  leftTimeBeforeDeadline(tasks) {
    tasks.forEach((value, key) => {
      tasks[key].leftEstimation = tasks[key].estimation - _.sum(tasks[key].slots.passedSlots.map(value => {
          return value.duration;
        }));

      return new Promise(resolve => {
        this.delegate.getSlots(new Date(this.startDate), new Date(tasks[key].days.endTime), 'free-time')
            .then(res => {
              tasks[key].leftHoursBeforeDeadline = this.delegate.getTotalFreeHoursInDailyMap(this.delegate.getFreeHoursDailyMapFromSlots(res.data));
              resolve(res.data);
            })
            .then(() => {
              //TODO: think on this !!!!!!maybe this cause en loop?
              this.recalculateExistingTasks(this.checkShiftAbilities(tasks));
            });
      });
    }, this);
  }

  /**
   *
   * @param {Array} tasksToShift, {Object} freeSlots
   * @param freeSlots
   * @description shifts future task slots to the appropriate free time
   */
  findAppropriateSlotsToShift(tasksToShift, freeSlots) {
    let hoursToFree = this.estimation - this.totalAvailHours;

    //TODO: implement shifting by priority
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
              }
            }, this);
          }
        }, this);
      }, this);
    }, this);
  }

  recalculateExistingTasks(tasks) {
    let freeSlots = [];

    return new Promise(resolve => {
      tasks.forEach(function (value, key) {
        this.delegate.getSlots(new Date(this.startDate.setDate(this.startDate.getDate() + 1)), value.days.endTime, 'free-time')
            .then(res => {
              this.slots = res.data;
              freeSlots.push(this.slots);
              resolve(this.slots);
            });
      }, this);
    }).then(() => {
      this.$timeout(() => {
        this.findAppropriateSlotsToShift(tasks, freeSlots);
        this.$rootScope.$broadcast('slotShiftedFromNegative');
        this.closeModalInstance();
      });
    });
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
