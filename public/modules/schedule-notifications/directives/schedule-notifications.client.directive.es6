class NotificationTooltip {
  constructor() {
    this.restrict    = 'A';
    this.controller  = 'ScheduleNotificationsController';
    this.templateUrl = '/modules/schedule-notifications/views/notifications-tooltip.client.view.html';
  }
}

angular
  .module('schedule-notifications')
  .directive('notificationTooltip', () => new NotificationTooltip());
