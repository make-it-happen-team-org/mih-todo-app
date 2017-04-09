class TimeSlot {
  constructor(duration, priority) {
    this.duration = duration;
    this.priority = parseInt(priority, 10);
  }
}

class Slot {
  constructor(duration, priority, dayId) {
    this.duration = duration;
    this.priority = parseInt(priority, 10);
    this.start    = (new Date(dayId)).setHours(0, 0, 0);
    this.end      = (new Date(dayId)).setHours(23, 59, 0);
  }
}

class Day {
  static get daysMap() {
    return { 0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat' };
  };

  constructor(data) {
    Object.assign(this, data);
    this.date     = new Date(this.date);
    this.settings = window.user.predefinedSettings.workingHours[Day.daysMap[this.date.getDay()]];
    this.date.setHours(0, 0, 0, 0);

    if (!this.freeTime) {
      this.freeTime = (Algorithm.timeToMinutes(this.settings.end) - Algorithm.timeToMinutes(this.settings.start)) / 60;
    }

    if (!this.bookedSlots) {
      this.bookedSlots = [];
    }

    if (!this.freeTimeStart) {
      this.freeTimeStart = new Date(this.date);
      this.freeTimeStart.setMinutes(Algorithm.timeToMinutes(this.settings.start));
    }
  }

  reserveSlot(duration, priority) {
    this.freeTime -= duration;
    this.reservedSlot = new TimeSlot(duration, priority);
  }

  bookSlot(taskId) {
    this.reservedSlot.taskId = taskId;
    this.bookedSlots.push(this.reservedSlot);
    delete this.reservedSlot;
  }

  createCalendarSlot(slot) {
    let freeTimeStart = new Date(this.freeTimeStart),
        freeTimeEnd   = new Date(freeTimeStart);

    freeTimeEnd.setMinutes(freeTimeEnd.getMinutes() + slot.duration * 60);
    this.freeTimeStart = freeTimeEnd;

    return {
      type:      slot.type || 'task',
      title:     slot.title || 'temp',
      start:     freeTimeStart,
      end:       freeTimeEnd,
      className: slot.type || 'task'
    };
  }
}

class Algorithm {

  /** @ngInject */
  constructor($q, Slots, Authentication, AlgorithmServer, AlgorithmPositive, TimeService, Notification) {
    Object.assign(this, {
      $q,
      Slots,
      user: Authentication.user,
      AlgorithmServer,
      AlgorithmPositive,
      TimeService,
      Notification
    });

    this.slotsRange         = [];
    this.slotsOccupiedSlots = [];
    this.priorityConfig     = {
      '1': {
        recommendedDuration: 3,
        isBalancedLoad:      false
      },
      '2': {
        recommendedDuration: 2,
        isBalancedLoad:      true
      },
      '3': {
        recommendedDuration: 2,
        isBalancedLoad:      false
      },
      '4': {
        recommendedDuration: 1,
        isBalancedLoad:      true
      }
    };
  }

  static timeToMinutes(time) {
    return time.split(':').reduce((prev, cur) => ((parseInt(prev, 10)) * 60) + parseInt(cur, 10));
  }

  static minutesToTime(minutes) {
    return [
      ('0' + Math.floor(minutes / 60)).substr(-2),
      ('0' + minutes % 60).substr(-2)
    ].join(':');
  }

  static algorithmBranchDataSetter(algorithmBranches, data) {
    return _.forEach(algorithmBranches, branch => {
      return Object.assign(branch, data);
    });
  }

  getSlots(startDate, endDate, type) {
    return this.AlgorithmServer.get({
      q:     type,
      start: startDate,
      end:   endDate
    }).$promise;
  }

  generateSlots(startDate, endDate, priority, estimation) {
    let defer = this.$q.defer();

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    this.getSlots(this.TimeService.fromDateToISOFormat(startDate), this.TimeService.fromDateToISOFormat(endDate), 'free-time')
        .then(res => {
          // TODO: inconsistent object structure! First time is array, then - object.
          this.slotsRange = res.data;

          // TODO: store response data separately, because fn below has side effects,
          // TODO: overwrites, so we cannot rely on this.slotsRange if we need consistency
          this.freeSlotsGroupedByDays = res.data;
          this.getDaysRecommendations(priority, estimation);
          defer.resolve(this.slotsRange);
        }, err => {
          defer.reject(err);
        });

    return defer.promise;
  }

  getSuitableSlots(recommendations, priority) {
    let suitableSlots = [],
        slot;

    Object.keys(this.slotsRange).forEach(dayId => {
      let slotDuration = recommendations[dayId];
      if (!slotDuration) return;

      slot = new Slot(slotDuration, priority, dayId);
      suitableSlots.push(slot);
    });

    return suitableSlots;
  }

  getFreeHoursDailyMapFromSlots(freeSlotsByDays) {
    return _.map(freeSlotsByDays, function (dayFreeSlots, dayId) {
      let day = {
        freeTime: _(dayFreeSlots).map(slot => slot.duration).sum(),
        date:     dayId
      };

      return day;
    });
  }

  getTotalFreeHoursInDailyMap(dailyMap) {
    return _.sum(dailyMap.map(day => day.freeTime));
  }

  getTimeAvailabilityFromSlotsGroupedByDays() {
    let dailyMap        = this.getFreeHoursDailyMapFromSlots(this.freeSlotsGroupedByDays);
    let totalAvailHours = this.getTotalFreeHoursInDailyMap(dailyMap);

    return {
      dailyMap,
      totalAvailHours
    };
  }

  getDaysRecommendations(priority, estimation) {
    let { dailyMap, totalAvailHours } = this.getTimeAvailabilityFromSlotsGroupedByDays();
    let data                          = {
          estimation,
          availableHoursPerDay: dailyMap,
          availableDaysAmount:  dailyMap.length,
          recommendedDuration:  this.priorityConfig[priority].recommendedDuration
        },
        isBalancedLoad                = this.priorityConfig[priority].isBalancedLoad,
        recommendations               = {};

    if (estimation <= totalAvailHours) {
      recommendations = isBalancedLoad ? this.AlgorithmPositive.getBalancedRecommendations(data) : this.AlgorithmPositive.getIntensiveRecommendations(data);
    } else {
			this.Notification.warning('No sufficient free time');
		}
    this.slotsRange = this.getSuitableSlots(recommendations, priority);
  }
}

angular.module('algorithm').service('Algorithm', Algorithm);
