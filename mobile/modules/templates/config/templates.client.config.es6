angular.module('templates').config(['$stateProvider', function ($stateProvider) {

    let mainViewRoute = function (stateParams) {
        let tasksRoute  = 'modules/templates/views/templates-tasks.client.view.html',
            eventsRoute = 'modules/templates/views/templates-events.client.view.html';

        if (_.isNil(stateParams.isTaskTemplatesEmpty)) {
            return (tasksRoute.indexOf(stateParams.templateType.split('Templates')[0]) !== -1) ? tasksRoute : eventsRoute;
        }

        return stateParams.isTaskTemplatesEmpty ? eventsRoute : tasksRoute;
    };

    $stateProvider.state('restricted.templates', {
        url:     '/templates',
        params:  {
            templateId:   '',
            templateType: '',
            category:     'templates'
        },
        views:   {
            'aside':     {
                templateUrl: 'modules/core/views/sidebar/template-groups-list.client.view.html'
            },
            'main-view': {
                templateUrl:  $stateParams => {
                    return mainViewRoute($stateParams);
                },
                controller:   'TemplatesController',
                controllerAs: 'templates'
            }
        },
        data:    {
            menuLabel: "presets"
        },
        resolve: {
            /** @ngInject */
            template: ($stateParams, TemplatesService, Authentication) => {
                if (!$stateParams.templateId || !$stateParams.templateType) {
                    if (_.isEmpty(TemplatesService.getLastUsed('taskTemplates', Authentication.user))) {
                        $stateParams.isTaskTemplatesEmpty = true;
                        return TemplatesService.getLastUsed('eventTemplates', Authentication.user);
                    } else {
                        $stateParams.isTaskTemplatesEmpty = false;
                        return TemplatesService.getLastUsed('taskTemplates', Authentication.user);
                    }
                }

                return TemplatesService.getById(Authentication.user, $stateParams.templateId, $stateParams.templateType);
            }
        }
    });
}]);
