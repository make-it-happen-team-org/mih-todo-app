// Setting up route

angular.module('core').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  let HOME_URL = '/todo';

  // Redirect to home view when route not found
  $urlRouterProvider.otherwise(HOME_URL);

  $stateProvider
    .state('restricted', {
      abstract: true,
      views:    {
        'root':    {
          templateUrl: 'modules/core/views/base.client.view.html'
        },
        'sidebar': {
          templateUrl:  'modules/sidebar/views/sidebar.client.view.html',
          controller:   'SidebarController',
          controllerAs: 'sidebarCtrl'
        },
        'footer':  {
          templateUrl:  'modules/core/views/footer.client.view.html',
          controller:   'FooterController',
          controllerAs: 'footerCtrl'
        }
      },
      resolve:  {
        /** @ngInject */
        user: (SessionService, $state) => {
          return SessionService.getSession().then(user => {
            if (!user._id) {
              $state.go('auth.signin');
            } else {
              SessionService.setUser(user);

              return user;
            }

            return user;
          });
        }
      }
    })
    .state('restricted.todo_state', {
      url:   HOME_URL,
      views: {
        'aside':     {
          templateUrl: 'modules/core/views/sidebar/todo.client.view.html'
        },
        'main-view': {
          templateUrl: 'modules/calendar/views/calendar.client.view.html'
        }
      },
      data:  {
        menuLabel: "plan your day"
      }
    });
}]);
