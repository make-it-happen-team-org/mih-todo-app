class ModalsController {
  /** @ngInject */
  constructor(ModalsService, $scope, $rootScope) {
    Object.assign(this, { // eslint-disable-line angular/controller-as-vm
      ModalsService,
      $scope,
      $rootScope
    });
  }

  renderModalData() {
    return {
      warning: this.$scope.ngDialogData.warningMsg, // eslint-disable-line angular/controller-as-vm
      title: this.$scope.ngDialogData.modalTitle, // eslint-disable-line angular/controller-as-vm
      timeToFree: this.$scope.ngDialogData.timeToFree, // eslint-disable-line angular/controller-as-vm
      firstHandler: this.$scope.ngDialogData.buttonsMsg.firstHandler, // eslint-disable-line angular/controller-as-vm
      secondHandler: this.$scope.ngDialogData.buttonsMsg.secondHandler // eslint-disable-line angular/controller-as-vm
    };
  }

  firstWayHandle() {
    // eslint-disable-next-line angular/controller-as-vm
    this.$rootScope.$broadcast(`CONFLICTED_${ this.$scope.ngDialogData.type }_FIRST`);
  }

  secondWayHandle() {
    // eslint-disable-next-line angular/controller-as-vm
    this.$rootScope.$broadcast(`CONFLICTED_${ this.$scope.ngDialogData.type }_SECOND`);
  }
}

angular.module('modals').controller('ModalsController', ModalsController);
