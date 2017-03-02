class FooterController {

    /** @ngInject */
    constructor($scope) {
        Object.assign(this, { $scope });
        this.activeMenu = '';
    }
}

angular
    .module('core')
    .controller('FooterController', FooterController);
