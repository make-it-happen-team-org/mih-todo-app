class SidebarController {
  /** @ngInject */
  constructor($scope, $state){
    Object.assign(this, {$scope, $state});

    this.topStatesInNavDropdown = [
      $state.get('todo_state'),
      $state.get('overdue'),
      $state.get('templates')
    ];

    // $state.current isn't available yet,
    // but we need to display selectedTopState in the navigation dropdown
    // that's why we subscribe to $stateChangeSuccess event,
    // and then investigate which topState is parent to the current $state
    $scope.$on('$stateChangeSuccess', (event, currentState, toParams, fromState, fromParams) => {
      // $state.current === currentState;

      let topStateToDisplayInNavDropdown = _.find(this.topStatesInNavDropdown, (oneOfParentNavStates) => {
        // find appropriate top state and attach to the view
        return $state.includes(oneOfParentNavStates.name);
      });
      if (topStateToDisplayInNavDropdown) {
        // always set TOP STATE to enable site navigation via dropdown
        // DO _NOT_ DO IT THIS WAY: Ctrl.selectedTopState = currentState;
        // setting currentState will add an empty option to dropdown
        this.selectedTopState = topStateToDisplayInNavDropdown;
      }
    });
  }

  goToState(newState) {
    if (!newState) return;
    this.$state.go(newState);
  };

  toggleSidebar() {
    this.$scope.$emit('toggleSidebar');
  }
}

angular
  .module('core')
  .controller('SidebarController', SidebarController);

