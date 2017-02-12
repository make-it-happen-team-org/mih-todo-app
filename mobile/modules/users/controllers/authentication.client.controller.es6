angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', function ($scope, $http, $location, Authentication) {
	$scope.authentication = Authentication;

	// If user is signed in then redirect back home
	if ($scope.authentication.user) $location.path('/');

	$scope.signup = function (isValid) {
		if (!isValid){
			$scope.signupForm.submitted = true;
			return false;
		}
		$http.post('auth/signup', $scope.credentials).success(function (response) {
			// If successful we assign the response to the global user model
			$scope.authentication.user = response;

			// And redirect to the index page
			window.location.reload();
			$location.path('/');
		}).error(function (response) {
			$scope.error = response.message;
		});
	};

	$scope.signin = function (isValid) {
		if (!isValid) {
			$scope.signinForm.submitted = true;
			return false;
		}
		$http.post('auth/signin', $scope.credentials).success(function (response) {
			// If successful we assign the response to the global user model
			$scope.authentication.user = response;

			// And redirect to the index page
			window.location.reload();
			$location.path('/');
		}).error(function (response) {
			$scope.error = response.message;
		});
	};
}]);
