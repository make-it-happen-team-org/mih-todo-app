//Start by defining the main module and adding the module dependencies

angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName)
    .config(['$locationProvider', 'NotificationProvider',
        ($locationProvider, NotificationProvider) => {
            $locationProvider.hashPrefix('!');

            NotificationProvider.setOptions({
                positionX: 'center',
                positionY: 'top'
            });
        }])
    .config((datepickerConfig) => {
        // http://stackoverflow.com/questions/20678009/remove-week-column-and-button-from-angular-ui-bootstrap-datepicker
        datepickerConfig.showWeeks = false;
        datepickerConfig.formatYear = 'yy';
        datepickerConfig.formatMonth = 'MMM';
        datepickerConfig.formatDay = 'd';
        datepickerConfig.startingDay = 1;
    }).run(function (RzSliderOptions) {
        RzSliderOptions.options({
            hideLimitLabels: true,
            hidePointerLabels: true,
            showSelectionBar: true
        });
});

//Then define the init function for starting up the application
angular.element(document).ready(() => {
    //Fixing facebook bug with redirect
    if (window.location.hash === '#_=_') window.location.hash = '#!';

    //Then init the app
    angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});