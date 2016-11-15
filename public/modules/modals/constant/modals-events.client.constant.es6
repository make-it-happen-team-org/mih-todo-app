angular.module('modals')
  .constant('MODALS_EVENTS', {
    taskFirst: 'CONFLICTED_TASK_FIRST',
    taskSecond: 'CONFLICTED_TASK_SECOND',
    eventFirst: 'CONFLICTED_EVENT_FIRST',
    eventSecond: 'CONFLICTED_EVENT_SECOND'
  })
  .constant('MODALS_TASK_MESSAGES', {
    type: 'TASK',
    warningMsg: 'Not sufficient free time for a new task',
    modalTitle: 'Confirmation Window',
    buttonsMsg: {
      firstHandler: 'Increase deadline or reduce estimation',
      secondHandler: 'Shift existing slots'
    }
  })
  .constant('MODALS_EVENT_MESSAGES', {
    type: 'EVENT',
    warningMsg: 'Do you want to leave existing tasks as is or shift them?',
    modalTitle: 'Confirmation Window',
    buttonsMsg: {
      firstHandler: 'Leave all tasks as is',
      secondHandler: 'Shift conflicted tasks'
    }
  });
