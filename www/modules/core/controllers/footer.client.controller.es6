class FooterController {
  constructor() {
    this.activeMenu = '';
  }
}

angular
  .module('core')
  .controller('FooterController', FooterController);
