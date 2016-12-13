/** @ngInject */
angular.module('users').config(($httpProvider) => {
    $httpProvider.defaults.withCredentials = true;

    /** @ngInject */
    $httpProvider.interceptors.push(($q, $location, Authentication) => {
        return {
            request: function (config) {
                if (!/html/.test(config.url)) {
                    config.url = `http://localhost:3000/${config.url}`;
                }

                return config;
            },
            responseError: function responseError(rejection) {
                switch (rejection.status) {
                    case 401:
                        // Deauthenticate the global user
                        Authentication.user = null;

                        // Redirect to signin page
                        $location.path('signin');
                        break;
                    case 403:
                        // Add unauthorized behaviour
                        break;
                }

                return $q.reject(rejection);
            }
        };
    });
});
