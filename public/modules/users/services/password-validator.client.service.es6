// PasswordValidator service used for testing the password strength
class PasswordValidator {
  constructor ($window) {
    Object.assign(this, { $window });

    this.owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;
    this.owaspPasswordStrengthTest.config({
      allowPassphrases: false,
      maxLength: 10,
      minLength: 6,
      minOptionalTestsToPass: 1
    });
    this.owaspPasswordStrengthTest.tests.optional = this.owaspPasswordStrengthTest.tests.optional.filter((val) => !(/one special character/).test(val));
  }
  getResult (password) {
    let result    = owaspPasswordStrengthTest.test(password);

    result.errors = result.errors.map((val) => val.replace(/The password (must|may)/g, '-'));

    return result;
  }
}
PasswordValidator.$inject = ['$window'];

angular
  .module('users')
  .factory('PasswordValidator', () => new PasswordValidator());