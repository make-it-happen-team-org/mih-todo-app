class PasswordValidatorDirective {
  constructor(PasswordValidatorFactory) {
    Object.assign(this, { PasswordValidatorFactory });
    this.restrict   = 'A';
    this.scope = false;

    const passwordEl = document.getElementById('password');
    if (passwordEl) {
      angular.element(passwordEl).scope().PasswordValidatorFactory = PasswordValidatorFactory;
    }
  }

  link(scope, element) {
    scope.errors = scope.$parent.PasswordValidatorFactory.getResult("").errors;
    scope.setErrors = () => {
      scope.errors = scope.$parent.PasswordValidatorFactory.getResult(scope.signupForm.password.$modelValue).errors;
    };
    scope.notifyIfInvalid = () => {
      scope.errors.length === 0
        ? $(element).closest('.form-group').removeClass("has-error")
        : $(element).closest('.form-group').addClass("has-error");
      scope.errors.length === 0 && scope.$valid
        ? element.addClass("valid")
        : element.removeClass("valid");
      scope.signupForm.password.$setValidity("password", scope.errors.length === 0);
    };
  }
}

// TODO Add controller
angular
  .module('users')
  .directive('passwordValidator', (PasswordValidatorFactory) => new PasswordValidatorDirective(PasswordValidatorFactory));