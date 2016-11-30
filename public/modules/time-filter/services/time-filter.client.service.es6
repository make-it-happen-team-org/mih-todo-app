class TimeService {

  /** @ngInject */
  constructor() {
    Object.assign(this, {

    });
    this.timeZoneInHours = TimeService._timeZoneInHoursGetter();
  }

  //TODO: need to extend by DB zone
  static _timeZoneInHoursGetter() {
    return new Date().getTimezoneOffset() / 60;
  }
  //F.e: 2016-11-30T16:43:00.000Z
  //we need this because in Algorithm we set 0 hours to dates
  fromDateToISOFormat(date) {
    return new Date(date.getTime() - this.timeZoneInHours * 60 * 60 * 1000).toISOString();
  }

  //need to return time with timeZone, to prevent future misunderstanding with time
  fromISOFormatToDate(isoDate) {
    return new Date(new Date(isoDate).getTime() + this.timeZoneInHours * 60 * 60 * 1000);
  }

  appendDaysToISODate(isoDate, daysToAdd) {
    let convertedFromISO = this.fromISOFormatToDate(isoDate);
    return this.fromDateToISOFormat(new Date(convertedFromISO.setDate(convertedFromISO.getDate() + daysToAdd)));
  }
}

angular.module('timeFilter').service('TimeService', TimeService);
