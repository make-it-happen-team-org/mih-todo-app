(function () {
	describe('HomeController', function () {
		let scope, HomeController;

		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		beforeEach(inject(function ($controller, $rootScope, Authentication) {
			scope = $rootScope.$new();
			scope.authentication = Authentication;

			HomeController = $controller('HomeController', {
				$scope: scope
			});
		}));

		it('should expose the authentication service', function () {
			expect(scope.authentication).toBeTruthy();
		});
	});
})();
