class SidebarController {
  constructor(Authentication, $rootScope, $http, $state, Notification) {
    this.user = Authentication.user;
    this.$rootScope = $rootScope;
    this.active = false;
    this.$http = $http;
    this.$state = $state;
    this.Notification = Notification;

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

    this.signOut = () => {
      $http.get('auth/signout')
        .then(() => {
            this.$state.go('auth.signin');
        })
        .catch(() => {
          Notification.error({
            message: 'Error logout'
          });
        });
    }
  }
}

angular.module('sidebar').controller('SidebarController', SidebarController);