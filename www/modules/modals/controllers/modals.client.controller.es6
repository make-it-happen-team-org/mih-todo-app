class ModalsController {

    /** @ngInject */
    constructor(ModalsService, $scope, $rootScope, Algorithm) {
        Object.assign(this, {
            ModalsService,
            $scope,
            $rootScope,
            Algorithm,

            warning:      $scope.ngDialogData.warningMsg,
            title:        $scope.ngDialogData.modalTitle,
            timeToFree:   $scope.ngDialogData.timeToFree,
            bodyMsg:      {
                leaveAsIs: $scope.ngDialogData.bodyMsg.leaveAsIs,
                shift:     $scope.ngDialogData.bodyMsg.shift
            },
            leaveAsIsMsg: $scope.ngDialogData.buttonsMsg.leaveAsIs,
            shiftMsg:     $scope.ngDialogData.buttonsMsg.shift
        });
    }

    leaveAsIsHandler() {
        this.Algorithm.AlgorithmNegative.closeModalInstance();
    }

    shiftHandler() {
        this.Algorithm.AlgorithmNegative.findAppropriateSlotsToShift(this.Algorithm.AlgorithmNegative.filteredTasks, this.Algorithm.AlgorithmNegative.freeSlots);
    }
}

angular.module('modals').controller('ModalsController', ModalsController);