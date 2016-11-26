class ModalsController {

  /** @ngInject */
  constructor(ModalsService, $scope, $rootScope) {
    Object.assign(this, {
      ModalsService,
      $scope,
      $rootScope
    });
  }

  renderModalData() {
    return {
      warning: this.$scope.ngDialogData.warningMsg,
      title: this.$scope.ngDialogData.modalTitle,
      timeToFree: this.$scope.ngDialogData.timeToFree,
      bodyMsg: {
        leaveAsIs: this.$scope.ngDialogData.bodyMsg.leaveAsIs,
        shift: this.$scope.ngDialogData.bodyMsg.shift
      },
      firstHandler: this.$scope.ngDialogData.buttonsMsg.leaveAsIs,
      secondHandler: this.$scope.ngDialogData.buttonsMsg.shift
    };
  }

  firstWayHandle() {
    this.$scope.$emit(`CONFLICTED_${this.$scope.ngDialogData.type}_FIRST`);
  }

  secondWayHandle() {
    this.$scope.$emit(`CONFLICTED_${this.$scope.ngDialogData.type}_SECOND`);
  }
}

angular.module('modals').controller('ModalsController', ModalsController);
