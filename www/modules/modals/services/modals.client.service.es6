class ModalsService {

    /** @ngInject */
    constructor(ngDialog) {
        Object.assign(this, {
            ngDialog
        });
    }

    getModalWindowOpen(msg) {
        this.ngDialog.open({
            template:        '/modules/modals/views/modals.view.html',
            controller:      'ModalsController',
            controllerAs:    'modal',
            width:           '55%',
            className:       'ngdialog-theme-default',
            appendClassName: 'mih-modal-theme',
            data:            msg
        });
    }

    getModalWindowClose() {
        this.ngDialog.close();
    }
}

angular.module('modals').service('ModalsService', ModalsService);
