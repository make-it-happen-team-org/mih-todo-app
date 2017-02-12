// Setting up route

angular.module('users').config(['$stateProvider', function ($stateProvider) {
    // Users state routing
    $stateProvider.state('restricted.profile', {
        url: '/settings/profile',
        views: {
            'aside': {templateUrl: 'modules/core/views/sidebar/todo.client.view.html'},
            'main-view': {
                templateUrl: 'modules/users/views/settings/edit-profile.client.view.html',
                controller: 'SettingsController',
                controllerAs: 'settings'
            }
        }
    });

    $stateProvider.state('auth', {
        abstract: true,
        views: {
            'root': {
                templateUrl: 'modules/core/views/base.client.view.html'
            }
        }
    }).state('auth.signup', {
        url: '/signup',
        views: {
            'main-view': {
                templateUrl: 'modules/users/views/authentication/signup.client.view.html'
            }
        }
    }).state('auth.signin', {
        url: '/signin',
        views: {
            'main-view': {
                templateUrl: 'modules/users/views/authentication/signin.client.view.html',
            }
        }
    }).state('auth.forgot', {
        url: '/password/forgot',
        views: {
            'main-view': {
                templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
            }
        }
    }).state('auth.reset-invalid', {
        url: '/password/reset/invalid',
        views: {
            'main-view': {
                templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
            }
        }
    }).state('auth.reset-success', {
        url: '/password/reset/success',
        views: {
            'main-view': {
                templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
            }
        }
    }).state('auth.reset', {
        url: '/password/reset/:token',
        views: {
            'main-view': {
                templateUrl: 'modules/users/views/password/reset-password.client.view.html'
            }
        }
    });
}]);
