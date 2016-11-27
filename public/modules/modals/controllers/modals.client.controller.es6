class ModalsController {

  /** @ngInject */
  constructor(ModalsService, $scope, $rootScope, Algorithm) {
    Object.assign(this, {
      ModalsService,
      $scope,
      $rootScope,
      Algorithm
    });
    this.warning = this.$scope.ngDialogData.warningMsg;
    this.title = this.$scope.ngDialogData.modalTitle;
    this.timeToFree = this.$scope.ngDialogData.timeToFree;
    this.bodyMsg = {
      leaveAsIs: this.$scope.ngDialogData.bodyMsg.leaveAsIs,
      shift: this.$scope.ngDialogData.bodyMsg.shift
    };
    this.leaveAsIsMsg = this.$scope.ngDialogData.buttonsMsg.leaveAsIs;
    this.shiftMsg = this.$scope.ngDialogData.buttonsMsg.shift
  }

  leaveAsIsHandler() {
    this.Algorithm.AlgorithmNegative.closeModalInstance();
  }

  shiftHandler() {
    this.Algorithm.AlgorithmNegative.getOccupiedSlots(this.Algorithm.AlgorithmNegative.startDate, this.Algorithm.AlgorithmNegative.endDate);
  }
}

angular.module('modals').controller('ModalsController', ModalsController);
