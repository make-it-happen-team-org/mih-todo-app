angular.module('modals')
  .constant('MODALS_TASK_MESSAGES', {
    type: 'TASK',
    modalTitle: 'Confirm Window',
    warningMsg: 'Not sufficient free time for a new task',
    bodyMsg: {
      leaveAsIs: 'Increase a deadline or reduce an estimation',
      shift: 'Shift existing slots'
    },
    buttonsMsg: {
      leaveAsIs: 'Free up time',
      shift: 'Shift slots'
    }
  })
  .constant('MODALS_EVENT_MESSAGES', {
    type: 'EVENT',
    modalTitle: 'Confirm Window',
    warningMsg: 'Do you want to leave existing tasks as is or shift them?',
    bodyMsg: {
      leaveAsIs: 'Leave all tasks as is',
      shift: 'Shift conflicted tasks'
    },
    buttonsMsg: {
      leaveAsIs: 'Leave tasks',
      shift: 'Shift tasks'
    }
  })
  .constant('MODALS_EVENTS', {
    taskFirst: 'CONFLICTED_TASK_FIRST',
    taskSecond: 'CONFLICTED_TASK_SECOND',
    eventFirst: 'CONFLICTED_EVENT_FIRST',
    eventSecond: 'CONFLICTED_EVENT_SECOND'
  });
