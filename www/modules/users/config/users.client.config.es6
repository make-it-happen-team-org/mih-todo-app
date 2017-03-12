/** @ngInject */
angular.module('users').config(($httpProvider) => {
  $httpProvider.defaults.withCredentials = true;

  /** @ngInject */
  $httpProvider.interceptors.push(($q, $location, Authentication, $window) => {
    return {
      request:       (config) => {
        if (!/html/.test(config.url)) {
          config.url = `${$window.MIH.endpointUrl}/${config.url}`;
        }

        return config;
      },
      responseError: rejection => {
        switch (rejection.status) {
        case 401:
          Authentication.user = null;
          $location.path('signin');
          break;
        case 403:
          // unauthorized behaviour
          break;
        }

        return $q.reject(rejection);
      }
    };
  });
});
