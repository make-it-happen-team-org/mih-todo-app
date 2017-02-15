class headerDropDown {
    constructor() {
        this.restrict    = 'A';
        this.controller  = 'MainController';
    }
    link($scope, $element, $attr, $ctrl) {
        $(document).on('click', { type: $attr.type },(event) => {
            const parents = $(event.target).parents();

            event.stopPropagation();
            if ($.inArray($element[0],parents) === -1 ) {
                $ctrl.toggleDropdown(event.data.type, true);
            }
        });
    }
}

angular
    .module('core')
    .directive('headerDropDown', () => new headerDropDown());