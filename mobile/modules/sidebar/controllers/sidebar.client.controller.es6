class SidebarController {
    constructor(Authentication) {
        this.user = Authentication.user;
    }
}

angular.module('sidebar').controller('SidebarController', SidebarController);