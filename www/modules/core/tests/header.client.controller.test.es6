(function () {
  describe('HeaderController', function () {
    let scope, HeaderController;

    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();

      HeaderController = $controller('HeaderController', {
        $scope: scope
      });
    }));

    it('should expose the authentication service', function () {
      expect(scope.authentication).toBeTruthy();
    });
  });
})();
