angular.module('users')
.directive('passwordValidator', ['PasswordValidator', "$popover", function(PasswordValidator,$popover ) {
	return {
		require: 'ngModel',
		link: function(scope, element, attr, ctrl) {

			var	validationPopover = $popover(element, {
				contentTemplate: 'validationErrorsTmp.html',
				html: true,
				trigger: 'focus',
				autoClose: false,
				placement: 'right-bottom',
				scope: scope
			});

			scope.errors = PasswordValidator.getResult("").errors;

			scope.validatePassword = function() {
				var password = element.val();

				scope.errors = PasswordValidator.getResult(password).errors;
				scope.errors.length === 0
					? validationPopover.hide()
					: validationPopover.show();
			};

			scope.notifyIfInvalid = function() {
				scope.errors.length === 0
					? $(element).closest('.form-group').removeClass("has-error")
					: $(element).closest('.form-group').addClass("has-error");

				scope.errors.length === 0 && ctrl.$valid 
					? element.addClass("valid")
					: element.removeClass("valid");

					scope.signupForm.password.$setValidity("password", scope.errors.length === 0);
			};
		}
	};
}]);
