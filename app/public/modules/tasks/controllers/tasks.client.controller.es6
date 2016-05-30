'use strict';

// Tasks controller

angular.module('tasks').controller('TasksController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Tasks', function ($scope, $rootScope, $stateParams, $location, Authentication, Tasks) {

	var date = new Date(),
		dateMax = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

	$scope.authentication = Authentication;

	$scope.dt = {
		srartDate: date,
		endDate: date
	};

	var d = new Date();
	d.setHours( 9 );
	d.setMinutes( 0 );

	var d2 = new Date();
	d2.setHours( 18 );
	d2.setMinutes( 0 );

	$scope.startTime = d;

	$scope.endTime = d2;

	$scope.startDate = {
		minDate: date,
		maxDate: dateMax
	};

	$scope.endDate = {
		minDate: date,
		maxDate: dateMax
	};

	$scope.clear = function () {
		return $scope.dt = null;
	};

	$scope.opened = {
		srartDate: false,
		endDate: false
	};

	$scope.openStart = function ($event) {
		$event.preventDefault();
		$event.stopPropagation();
		return $scope.opened = {
			srartDate: true,
			endDate: false
		};
	};
	$scope.openEnd = function ($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.dt.endDate = $scope.dt.srartDate;
		$scope.endDate.minDate = $scope.dt.srartDate;
		return $scope.opened = {
			srartDate: false,
			endDate: true
		};
	};

	$scope.dateOptions = {
		srartDate: {
			'year-format': 'yy',
			'starting-day': 1

		},
		endDate: {
			'year-format': 'yy',
			'starting-day': 1
		}
	};

	$scope.slider = {
		value: 12,
		options: {
			floor: 0,
			ceil: 24
		}
	};

	// Create new Task
	$scope.create = function () {
		// Create new Task object
		var task = new Tasks({
			title: this.title,
			type: "task",
			priority: this.priority,
			days: {
				startTime: this.withOutDate ? '' : this.dt.srartDate,
				endTime: this.withOutDate ? '' : this.dt.endDate
			},
			estimation: this.slider.value,
			notes: this.notes
		});

		task.$save(function (response) {
			$location.path('/');
			$scope.title = '';
			$rootScope.$broadcast('NEW_TASK_MODIFY');
		}, function (errorResponse) {
			$scope.validationError = errorResponse.data.message.errors;
		});
		$scope.tasks = [];
	};

	$scope.cancel = function () {
		$location.path('/');
	};

	// Remove existing Task
	$scope.remove = function (task) {
		if (task) {
			task.$remove();

			for (var i in $scope.tasks) {
				if ($scope.tasks[i] === task) {
					$scope.tasks.splice(i, 1);
				}
			}
			$rootScope.$broadcast('NEW_TASK_MODIFY');
		} else {
			$scope.task.$remove(function () {
				$location.path('/');
			});
			$rootScope.$broadcast('NEW_TASK_MODIFY');
		}
	};


	// Update existing Task
	$scope.update = function () {
		var task = $scope.task;
		task.title = $scope.title;

		task.$update(function () {
			$location.path('tasks/' + task._id);
			$rootScope.$broadcast('NEW_TASK_MODIFY');
		}, function (errorResponse) {
			$scope.error = errorResponse.data.message;
		});
	};

	// Find existing Task
	$scope.findOne = function () {
		$scope.task = Tasks.get({
			taskId: $stateParams.taskId
		});
	};
}]);
