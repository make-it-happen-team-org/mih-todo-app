class MainController {
  /** @ngInject */
  constructor($scope) {
    Object.assign(this, { $scope });
  }

  toggleSidebar() {
    this.$scope.$emit('toggle_sidebar');
  }
}

angular
  .module('core')
  .controller('MainController', MainController);