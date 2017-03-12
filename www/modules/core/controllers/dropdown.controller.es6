class DropdownController {
  constructor() {
    this.dropdown = false;
  }

  toggleDropdown() {
    this.dropdown = !this.dropdown;
  }
}

angular
  .module('core')
  .controller('DropdownController', DropdownController);

