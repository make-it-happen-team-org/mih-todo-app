class SidebarController {
  constructor(Authentication, $rootScope) {
    this.user = Authentication.user;
    this.$rootScope = $rootScope;
    this.active = false;

    this.$rootScope.$on('toggle_sidebar',() => {
      this.toggleSidebar();
    });

    this.$rootScope.$on('disable_sidebar', () => {
      this.disableSidebar();
    });

    this.$rootScope.$on('enable_sidebar', () => {
      this.enableSidebar();
    });

    this.disableSidebar = () => {
      this.active = false;
    };

    this.enableSidebar = () => {
      this.active = true;
    };

    this.toggleSidebar = () => {
      this.active = !this.active;
    };

    this.$rootScope.$on('$stateChangeSuccess', () => {
      this.disableSidebar();
    });
  }
}

angular.module('sidebar').controller('SidebarController', SidebarController);