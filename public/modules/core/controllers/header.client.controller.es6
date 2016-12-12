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
    this.dropdown = {
      user: false,
      notification: false
    };
    this.goToState('todo_state');

    $scope.$on('$stateChangeSuccess', (event, currentState, toParams, fromState, fromParams) => {
      // TODO can clean cotrollers on this event
    });
  }

  goToState(state, toggledSidebar) {
    if (state) {
      this.$state.go(state);
    }
  };

  toggleSidebar() {
    this.$scope.$emit('toggleSidebar');
  }

  toggleDropdown(dropdownItem) {
    for(let item in this.dropdown) {
      if (this.dropdown.hasOwnProperty(item)) {
        if (item === dropdownItem){
          this.dropdown[item] = !this.dropdown[item]
        } else {
          this.dropdown[item] = false;
        }
      }
    }
  }

}

angular
  .module('core')
  .controller('HeaderController', HeaderController);

