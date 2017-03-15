class SidebarController {
  /*@ngInject*/
  constructor(Authentication, $state) {
    Object.assign(this, {Authentication, $state});
    this.user = this.Authentication.user;
  }
  singOut (){
    this.state.go('auth.signin');
    this.user = undefined;
  }
}

angular
  .module('sidebar')
  .controller('SidebarController', SidebarController);