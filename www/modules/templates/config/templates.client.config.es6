angular.module('templates').config(['$stateProvider', function ($stateProvider) {
  $stateProvider
    .state('restricted.templates', {
      url:   '/templates',
      views: {
        'main-view': {
          templateUrl:  'modules/templates/views/templates.client.view.html',
          controller:   'TemplatesController',
          controllerAs: 'templatesCtrl'
        }
      }
    });
}]);
