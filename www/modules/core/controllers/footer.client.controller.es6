class FooterController {

    /** @ngInject */
    constructor($scope, $state) {
        Object.assign(this, { $scope, $state });

        this.activeMenu = '';
        this.isLoginPage = this.isLoginPage();
    }

    isLoginPage() {
      return /^auth/g.test(this.$state.current.name);
    }
}

angular
    .module('core')
    .controller('FooterController', FooterController);
