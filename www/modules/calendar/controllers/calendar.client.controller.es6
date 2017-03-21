//http://fullcalendar.io/docs/

class Calendar {
  /** @ngInject */
  constructor(Slots, ScheduleNotifications, uiCalendarConfig, $rootScope, $scope, Authentication, $http) {
    Object.assign(this, {
      $http,
      Slots,
      $scope,
      $rootScope
    });

    this.config        = uiCalendarConfig;
    this.Notifications = ScheduleNotifications;
    this.user          = Authentication.user;

    this.bookedSlots  = [];
    this.eventSources = [
      this.getEvents.bind(this)
    ];
    let hours         = _.chain(this.user.predefinedSettings.workingHours).toArray();

    this.uiConfig = {
      calendar: {
        height:        700,
        editable:      true,
        header:        {
          left:   'prev,next',
          center: 'title',
          right:  'agendaDay, agendaWeek, month'
        },
        allDaySlot:    false,
        scrollTime:    hours.map(day => day.start).min().value(),
        businessHours: false,
        firstDay:      1,
        defaultView:   'agendaDay',
        timezone:      'local',
        eventDrop:     (event, delta, revertFunc) => this.eventDropHandler(event, delta, revertFunc)
      }
    };

    //Listen for new task form slot generation
    this.$scope.$on('NEW_SLOTS_GENERATED', (e, slots) => this.renderBookedSlots(slots));
    this.setBusinessHours();
  }

  getEvents(start, end, timezone, callback) {
    this.$http.get('slots', {
      params: {
        start,
        end
      }
    }).then(response => callback(response.data));
  }

  generateBgSlot(start, end, dayIndex) {
    if (dayIndex === 7) dayIndex = 0; //For sunday

    return {
      start:     start,
      end:       end,
      rendering: 'background',
      dow:       [dayIndex]
    }
  }

  setBusinessHours() {
    let nonWorkingHours = [];

    Object.keys(this.user.predefinedSettings.workingHours).forEach(key => {
      let day = this.user.predefinedSettings.workingHours[key];

      if (day.isWorkingDay) {
        nonWorkingHours.push(
          this.generateBgSlot('00:00', day.start, day.dayIndex),
          this.generateBgSlot(day.end, '24:00', day.dayIndex)
        );
      } else {
        nonWorkingHours.push(
          this.generateBgSlot('00:00', '24:00', day.dayIndex)
        );
      }
    });

    this.eventSources.push(nonWorkingHours);
  }

  eventDropHandler(event, delta, revertFunc) {
    if (event.taskId) { //Update slot in database
      new this.Slots(event).$update(response => {

      }, err => revertFunc)
    } else { //Update slot on new task form
      this.$rootScope.$broadcast('NEW_SLOTS_CHANGED',
        this.config.calendars.main.fullCalendar('clientEvents', event => {
          //return only slots from the original array
          if (event.source.origArray == this.bookedSlots) return event;
        })
      );
    }
  }

  renderBookedSlots(slots) {
    this.config.calendars.main.fullCalendar('removeEventSource', this.bookedSlots);
    this.config.calendars.main.fullCalendar('addEventSource', slots);
    this.bookedSlots = slots;
  }

  toggleSidebar() {
    this.$scope.$emit('toggle_sidebar');
  }
}

angular.module('calendar').controller('CalendarController', Calendar);
