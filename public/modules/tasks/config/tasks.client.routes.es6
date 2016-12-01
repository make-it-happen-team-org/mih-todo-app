'use strict';

//Setting up route
angular.module('tasks').config(['$stateProvider',
	function ($stateProvider) {
		// Tasks state routing
		$stateProvider
			.state('restricted.todo_state.tasks', {
				url: '/tasks',
				abstract: true
			})
			.state('restricted.todo_state.tasks.create', {
				url: '/create',
				views: {
					'main-view@restricted': {
						templateUrl: 'modules/tasks/views/create-task.client.view.html'
					}
				}
			})
			.state('restricted.todo_state.tasks.edit', {
				url: '/:taskId/edit',
				views: {
					'main-view@restricted': {
						templateUrl: 'modules/tasks/views/edit-task.client.view.html'
					}
				}
			})
		;
	}
]);
