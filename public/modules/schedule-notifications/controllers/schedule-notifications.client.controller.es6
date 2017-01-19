// TODO Call setInterval several times without releasing it bad organized code

angular.module('schedule-notifications').controller('ScheduleNotificationsController',
  ['$scope', '$rootScope', '$stateParams', 'Authentication', 'ScheduleNotifications', '$interval', '$location', '$state', 'Slots', 'Tasks', 'Notification',
    function ($scope, $rootScope, $stateParams, Authentication, ScheduleNotifications, $interval, $location, $state, Slots, Tasks, Notification) {
      // TODO: move to common app config
      const NOTIFICATIONS_INTERVAL = 30 * 60 * 1000;
      const CALENDAR_TIME_UNIT = 30 * 60 * 1000; // Calendar works only with time that is multiple of 30 minutes
      let currentTime = moment(),
          closestTimeUnitEnd = moment(Math.ceil(currentTime / CALENDAR_TIME_UNIT) * CALENDAR_TIME_UNIT),
          initialInterval = closestTimeUnitEnd - currentTime;

      var getOverdueTaskProgress = (task) => {
        return {
          percent: +((task.progress * 100) / task.estimation).toFixed(2)
        }
      };

      var getFormattedDataForCompleteSlot = (slot) => {
        var allSlots          = $scope.notifications.allSlots;
        var overdueTasks      = $scope.notifications.overdueTasks;
        var overdueSlots      = $scope.notifications.overdueSlots;
        var overdueTaskBySlot = getTaskBySlot(overdueTasks, slot);
        var overdueTaskSlots  = allSlots.filter(function (slot) {
          return slot.taskId === overdueTaskBySlot._id;
        });
        var completeSlotsQty  = overdueTaskSlots.filter(function (slot) {
          return slot.isComplete;
        }).length;

        return {
          slotToComplete:      slot,
          isCurrentTaskPage:   false,
          overdueTask:         overdueTaskBySlot,
          overdueTaskProgress: getOverdueTaskProgress(overdueTaskBySlot).percent,
          overdueTasksQty:     overdueTasks.length,
          overdueSlotsQty:     overdueSlots.filter(function (slot) {
            return slot.taskId === overdueTaskBySlot._id;
          }).length,
          isCompetedTask:      (overdueTaskSlots.length - 1 === completeSlotsQty)
        }
      };

      var getTaskBySlot = (tasks, slot) => {
        return tasks.filter(function (el) {
          return el._id === slot.taskId;
        })[0];
      };

      var updateActivity = (cfg) => {
        cfg.slotToComplete.isComplete = true;
        Slots.update(cfg.slotToComplete,
          () => updateOverdueSlotSuccessHandler(cfg));
      };

      var updateOverdueSlotSuccessHandler = (cfg) => {
        if (cfg.isCompetedTask) {
          cfg.overdueTask.isComplete = true;
        }
        cfg.overdueTask.progress += cfg.slotToComplete.duration;

        Tasks.update(cfg.overdueTask,
          () => updateOverdueTaskSuccessHandler(cfg),
          (errorResponse) => {
            console.log(errorResponse);
          });
      };

      var updateOverdueTaskSuccessHandler = (cfg) => {
        var overdueTaskProgress = getOverdueTaskProgress(cfg.overdueTask).percent;

        if (!cfg.isCurrentTaskPage) {
          if (cfg.overdueTasksQty === 1 && cfg.overdueSlotsQty === 1) {
            $location.path('/');
          }

          if (cfg.isCompetedTask) {
            Notification.success({ message: `Good job, ${$scope.authentication.user.username}! Task complete.` });
          } else {
            Notification.success({ message: `Good job, ${$scope.authentication.user.username}! ${overdueTaskProgress}% done.` });
          }

        } else {
          $rootScope.$broadcast('COMPLETED_SLOT_FROM_OVERDUE');
        }

        $rootScope.$broadcast('NEW_TASK_MODIFY');
      };

      let getNotifications = () => {
        $scope.notifications = ScheduleNotifications.query();
      };

      $scope.getNotifications = getNotifications;

      $scope.authentication = Authentication;

      $scope.getTaskDonePercentage = (task) => {
        return getOverdueTaskProgress(task).percent;
      };

      $scope.find = () => {
        getNotifications();

        $interval(() => {
          getNotifications();
          
          $interval(() => {
            getNotifications();
          }, NOTIFICATIONS_INTERVAL);
          
        }, initialInterval, 1);
      };

      $scope.getNonCompletedSlotsLength = () => {
        if(!$scope.notifications.overdueSlots) {
          return 0;
        }
        return $scope.notifications.overdueSlots.filter((slot)=> {
          return !slot.isComplete;
        }).length;
      };

      $scope.completeSlot = (slot) => {
          let cfg = getFormattedDataForCompleteSlot(slot);

          if ($stateParams.taskId === cfg.overdueTask._id) {
            cfg.isCurrentTaskPage = true;
          }
          updateActivity(cfg);
      };
    }
  ]);
