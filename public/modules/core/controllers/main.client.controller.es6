function toggleSidebarHandler () {
  this.sidebarCollapsed = !this.sidebarCollapsed;
  this.$timeout(() => {
    this.$scope.$broadcast('rzSliderForceRender');
  }, 500);
}

class MainController {
  /** @ngInject */
  constructor($scope, Authentication, $location, $timeout) {
    Object.assign(this, {$scope, Authentication, $location, $timeout});

    if (!Authentication.user) {
      $location.path('/signin');
    }
    this.sidebarCollapsed = false;

    $scope.$on('toggleSidebar', toggleSidebarHandler.bind(this));
  }
}

angular
  .module('core')
  .controller('MainController', MainController);