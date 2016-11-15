angular.module(appConfig.applicationModuleName, appConfig.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(appConfig.applicationModuleName)
  .config(['$locationProvider', 'NotificationProvider',
    ($locationProvider, NotificationProvider) => {
      $locationProvider.hashPrefix('!');
      NotificationProvider.setOptions({
        positionX: 'center',
        positionY: 'top'
      });
    }])
  .config((datepickerConfig) => {
    // http://stackoverflow.com/questions/20678009/remove-week-column-and-button-from-angular-ui-bootstrap-datepicker
    datepickerConfig.showWeeks = false;
    datepickerConfig.formatYear = 'yy';
    datepickerConfig.formatMonth = 'MMM';
    datepickerConfig.formatDay = 'd';
    datepickerConfig.startingDay = 1;
  })
  .run(($rootScope, Authentication, $state) => {
    //Prevent anonymous user access to all pages except auth
    const notLoggedUserAvailableStates = ['signin', 'signup'];

    // We don't need to create redundant variable 'cause we use rootScope
    // eslint-disable-next-line
    $rootScope.$on('$stateChangeStart', (event, toState) => {
      if (!Authentication.user && notLoggedUserAvailableStates.indexOf(toState.name) === -1) {
        event.preventDefault();
        $state.transitionTo('signin');
      }
    });
  });

//Then define the init function for starting up the application
angular.element(document).ready(() => {
  //Fixing facebook bug with redirect. Disabling ESLint because we don't need extra injection here
  /* eslint-disable */
  if (window.location.hash === '#_=_') {
    window.location.hash = '#!';
  }
  /* eslint-enable */

  //Then init the app
  angular.bootstrap(document, [appConfig.applicationModuleName]);
});
