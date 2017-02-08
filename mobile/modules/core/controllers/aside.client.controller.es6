class AsideController {
  /** @ngInject */
  constructor($scope, Authentication, $state) {
    Object.assign(this, { $scope, Authentication, $state });

    this.user = this.Authentication.user;

    $scope.$on('updateUserInfo', (event, user) => {
      angular.copy(user, this.user);
    });
  }

  toggleSidebar() {
    this.$scope.$emit('toggleSidebar');
  }
}

angular
  .module('core')
  .controller('AsideController', AsideController);
