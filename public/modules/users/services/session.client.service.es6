class SessionService {
    /** @ngInject */
    constructor($http, $rootScope, $window, Authentication) {
        Object.assign(this, {
            $http,
            $window,
            $rootScope,
            Authentication
        })
    }

    getSession() {
        return this.$http.get(`session`).then(response => response.data);
    }

    setUser(user) {
        this.$rootScope.user = this.$window.user = this.Authentication.user = user;
    }
}

angular.module('users').service('SessionService', SessionService);