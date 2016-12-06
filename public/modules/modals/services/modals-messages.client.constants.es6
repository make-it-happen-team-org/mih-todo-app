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
  });
