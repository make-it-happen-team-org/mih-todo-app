class ExpanderDirective {
  constructor() {
    this.restrict    = 'E';
    this.replace     = true;
    this.transclude  = true;
    this.scope       = {
      iconClass: '@',
      title:     '@'
    };
    this.templateUrl = '/modules/core/views/main/expander.client.view.html';
  }

  link(scope) {
    scope.isVisible    = false;
    scope.handleToggle = () => {
      scope.isVisible = !scope.isVisible;
    };
  }

}

angular
  .module('core')
  .directive('expander', () => new ExpanderDirective());
