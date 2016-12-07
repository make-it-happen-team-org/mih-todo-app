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

  isShiftCapable(hoursBeforeDeadline, leftEstimation) {
    return !!(hoursBeforeDeadline - leftEstimation);
  }

  leftEstimationCalc(task) {
    return task.estimation - _.sum(task.slots.passedSlots.map(value => {
      return value.duration;
    }));
  };

  /**
   *
   * @param {Array} tasksToShift, {Object} freeSlots
   * @param freeSlots
   * @description shifts future task slots to the appropriate free time
   */
  findAppropriateSlotsToShift(tasksToShift, freeSlots) {
    let hoursToFree           = this.estimation - this.totalAvailHours;
    let sortedTasksByPriority = _.reverse(tasksToShift);

    sortedTasksByPriority.forEach((value, key) =>{
      value.slots.futureSlots.forEach((v, index) => {
        let slotDuration = v.duration;
        let freePlaces   = freeSlots[key];

        Object.keys(freePlaces).forEach((ky, ind) => {
          while (hoursToFree > 0) {
            freePlaces[ky].forEach((val, k) => {
              //TODO: think maybe there is no need to check freeSlotDuration as we have sorting mechanism
              if (val.duration >= slotDuration) {
                hoursToFree -= slotDuration;

                //TODO: check time and use TimeService
                value.slots.futureSlots[index].start = val.start;
                value.slots.futureSlots[index].end   = new Date(new Date(val.start).setHours(new Date(val.start).getHours() + this.estimation)).toISOString();

                this.Slots.update(value.slots.futureSlots[index]);
              }
            });
          }
        });
      });
    });
  }

  recalculateExistingTasks(tasks) {
    let freeSlots = [];
    var deferObj = {};

    tasks.forEach((value, key) => {
      deferObj[key] = this.delegate.getSlots(
          this.TimeService.appendDaysToISODate(this.startDate, 1),
          this.TimeService.fromDateToISOFormat(value.days.endTime), //TODO: time error
          'free-time'
      );
    });

    $q.all(deferObj)
      .then(data => {
        console.log('deferData', data);

        tasks.forEach((value, key) => {
          console.log('endDateDefer', value.days.endTime);

          this.slots = data[key].data; //???

          value.leftHoursBeforeDeadline = this.delegate.getTotalFreeHoursInDailyMap(this.delegate.getFreeHoursDailyMapFromSlots(this.slots));
          value.leftEstimation = this.leftEstimationCalc(value);
          value.isShiftCapable = this.isShiftCapable(value.leftHoursBeforeDeadline, value.leftEstimation);

          //TODO: is this right index?
          freeSlots.splice(key, 0, this.slots);
        });

      })
      .then(() => {
        let indexes = [];

        let filteredTasks = _.filter(tasks, (task, index) => {
          if (!task.isShiftCapable) { indexes.push(index); }
          return task.isShiftCapable;
        });

        console.log('freeSlotsBefore', freeSlots);
        for (var i = indexes.length - 1; i >= 0; i--) {
          freeSlots.splice(indexes[i], 1);
        }
        console.log('freeSlotsAfter', freeSlots);

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
