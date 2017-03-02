angular.module('tasks').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('restricted.todo_state.tasks', {
                url:      '/tasks',
                abstract: true
            })
            .state('restricted.todo_state.tasks.list', {
                url:   '/list',
                views: {
                    'main-view@restricted': {
                        templateUrl: 'modules/tasks/views/list-tasks.client.view.html'
                    }
                }
            })
            .state('restricted.todo_state.tasks.details', {
                url:   '/:taskId/details',
                views: {
                    'main-view@restricted': {
                        templateUrl: 'modules/tasks/views/details-task.client.view.html'
                    }
                }
            })
            .state('restricted.todo_state.tasks.create', {
                url:   '/create',
                views: {
                    'main-view@restricted': {
                        templateUrl: 'modules/tasks/views/create-task.client.view.html'
                    }
                }
            })
            .state('restricted.todo_state.tasks.edit', {
                url:   '/:taskId/edit',
                views: {
                    'main-view@restricted': {
                        templateUrl: 'modules/tasks/views/edit-task.client.view.html'
                    }
                }
            });
    }
]);
