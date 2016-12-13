class MainController {
  /** @ngInject */
  constructor($scope, $location, $timeout, $state, Authentication) {
    Object.assign(this, {$scope, $location, $timeout, $state, Authentication});

    if (!Authentication.user) {
      $location.path('/signin');
    }

    this.sidebarCollapsed = false;
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

    this.$scope.$on('toggleSidebar', () => {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    });

    $scope.$on('$stateChangeSuccess', (event, currentState, toParams, fromState, fromParams) => {
      // TODO can clean cotrollers on this event
    });
  }


  goToState(state) {
    if (state) {
      this.$state.go(state);
    }
    if (this.sidebarCollapsed) {
      this.sidebarCollapsed = false;
    }
  };

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
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
  .controller('MainController', MainController);