class HeaderController {
  /** @ngInject */
  constructor($scope, $state, Authentication){
    Object.assign(this, {$scope, $state, Authentication});

    this.user = this.Authentication.user;

    this.topStatesInNavDropdown = [
      $state.get('todo_state'),
      $state.get('overdue'),
      $state.get('templates')
    ];

    this.goToState('todo_state');

    $scope.$on('$stateChangeSuccess', (event, currentState, toParams, fromState, fromParams) => {
      // TODO can clean cotrollers on this event
    });
  }

  goToState(state) {
    if (state) {
      this.$state.go(state)
    }
  };

  toggleSidebar() {
    this.$scope.$emit('toggleSidebar');
  }
}

angular
  .module('core')
  .controller('HeaderController', HeaderController);

