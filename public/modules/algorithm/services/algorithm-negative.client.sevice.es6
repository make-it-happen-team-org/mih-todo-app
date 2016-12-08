class AlgorithmNegative {

  /** @ngInject */
  constructor($rootScope, $q, Slots, ModalsService, TimeService, MODALS_TASK_MESSAGES) {
    Object.assign(this, {
      $rootScope,
      $q,
      Slots,
      ModalsService,
      TimeService,
      MODALS_TASK_MESSAGES,
      slotTypes: {
        task:  'task',
        event: 'event'
      }
    });
  }

  initialize(slotType, totalAvailTime) {
    this.openModalForDecision(slotType, `(you need to free up ${this.estimation - totalAvailTime} h)`);
    this.totalAvailHours = totalAvailTime;
  }

  getOccupiedSlots(startDate, endDate) {
    let defer = this.$q.defer();

    this.delegate.getSlots(startDate, endDate, 'occupied-time')
      .then(res => {
        this.slotsOccupiedSlots = {
          slots: res.slots,
          tasks: res.tasks
        };

        defer.resolve(this.slotsOccupiedSlots);

        return this.aggregateTasksWithSlots(this.slotsOccupiedSlots);
      })
      .then((aggregatedTasksWithSlots) => {
        this.recalculateExistingTasks(aggregatedTasksWithSlots);
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

    _.forEach(tasks, (value, key) => {
      tasks[key].slots = {
        passedSlots: [],
        futureSlots: []
      };

      let indexArrPassed = this._findIndexForSlots(concatSlots.arrayOfPassedSlots, value._id);
      let indexArrFuture = this._findIndexForSlots(concatSlots.arrayOfFutureSlots, value._id);

      _.forEach(indexArrPassed, index => { tasks[key].slots.passedSlots.push(slots.passedSlots[index]); });
      _.forEach(indexArrFuture, index => { tasks[key].slots.futureSlots.push(slots.futureSlots[index]); });
    });

    return tasks;
  }

  isShiftCapable(hoursBeforeDeadline, leftEstimation) {
    return !!(hoursBeforeDeadline - leftEstimation);
  }

  leftEstimationCalc(task) {
    return task.estimation - _.sum(task.slots.passedSlots.map(value => {
      return value.duration;
    }));
  };

  _freeSlotsUpdate(key, newValue, freeSlots) {
    _.forEach(freeSlots, (value, index) => {
      if (value[key]) {
        value[key] = newValue;
      }
    });

    return freeSlots;
  }

  /**
   *
   * @param {Array} tasksToShift, {Object} freeSlots
   * @param freeSlots
   * @description shifts future task slots to the appropriate free time
   */
  findAppropriateSlotsToShift(tasksToShift, freeSlots) {
    let sortedTasksByPriority = _.reverse(tasksToShift);
    let sortedFreeSlotsByPriority = _.reverse(freeSlots);
    let hoursToFree = this.estimation - this.totalAvailHours;
    let counter = 0;

    _.forEach(sortedTasksByPriority, (value, key) => {
      let slotDuration = value.slots.futureSlots[counter].duration;
      let freePlaces = sortedFreeSlotsByPriority[counter];

      if (hoursToFree <= 0) { return false; }

      _.forEach(Object.keys(freePlaces), (freeDay, index) => {

        if (hoursToFree <= 0) { return false; }

        _.forEach(freePlaces[freeDay], (freeSlot, i) => {
          if (freeSlot.duration >= slotDuration) {

            value.slots.futureSlots[counter].start = freeSlot.start;
            value.slots.futureSlots[counter].end = new Date(new Date(freeSlot.start).setHours(new Date(freeSlot.start).getHours() + value.slots.futureSlots[counter].duration)).toISOString();

            hoursToFree -= slotDuration;

            freeSlot.start = value.slots.futureSlots[counter].end;
            freeSlot.duration = freeSlot.duration - value.slots.futureSlots[counter].duration;

            sortedFreeSlotsByPriority = this._freeSlotsUpdate(freeDay, freePlaces[freeDay], sortedFreeSlotsByPriority);

            console.log(this.Slots);

            this.Slots.update(value.slots.futureSlots[counter]);
            return false;
          }
        });
      });

      counter = (key === sortedTasksByPriority.length) ? counter + 1 : counter;
    });
  }

  recalculateExistingTasks(tasks) {
    let freeSlots = [];
    var deferObj = {};

    tasks.forEach((value, key) => {
      deferObj[key] = this.delegate.getSlots(
          this.TimeService.appendDaysToISODate(this.startDate, 1),
          this.TimeService.addTimeZoneToISODate(value.days.endTime),
          'free-time'
      );
    });

    this.$q.all(deferObj)
      .then(data => {
        _.forEach(tasks, (value, key) => {
          this.slots = data[key].data;

          value.leftHoursBeforeDeadline = this.delegate.getTotalFreeHoursInDailyMap(this.delegate.getFreeHoursDailyMapFromSlots(this.slots));
          value.leftEstimation = this.leftEstimationCalc(value);
          value.isShiftCapable = this.isShiftCapable(value.leftHoursBeforeDeadline, value.leftEstimation);
          
          freeSlots.splice(key, 0, this.slots);
        });
      })
      .then(() => {
        let indexes = [];

        let filteredTasks = _.filter(tasks, (task, index) => {
          if (!task.isShiftCapable) { indexes.push(index); }
          return task.isShiftCapable;
        });
        
        for (var i = indexes.length - 1; i >= 0; i--) {
          freeSlots.splice(indexes[i], 1);
        }

        this.findAppropriateSlotsToShift(filteredTasks, freeSlots);
        this.$rootScope.$broadcast('slotShiftedFromNegative');
        this.closeModalInstance();
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
